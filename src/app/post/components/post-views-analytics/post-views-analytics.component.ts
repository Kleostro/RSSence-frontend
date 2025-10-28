import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { DatePicker } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';

import { PostViewDailyStatResponse } from '@/app/api/schemas/post/post-view-daily-stat-response';
import { TIME } from '@/app/constants/time';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { toUTCDateString } from '@/app/utils/to-utc-date-string';

const BASE_DATASET = {
  fill: true,
  pointBorderWidth: 2,
  pointHitRadius: 30,
  pointHoverRadius: 10,
  pointRadius: 5,
  tension: 0.4,
};
const DEFAULT_START_DATE = new Date(Date.now() - TIME.WEEK);
const DEFAULT_END_DATE = new Date(new Date().getTime() - TIME.DAY);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartModule, FormsModule, DatePicker, SkeletonModule],
  selector: 'app-post-views-analytics',
  styleUrl: './post-views-analytics.component.scss',
  templateUrl: './post-views-analytics.component.html',
})
export class PostViewsAnalyticsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigationService = inject(NavigationService);
  public analyticDataByPost = input<null | PostViewDailyStatResponse[]>(null);
  private analyticDataByPost$ = toObservable(this.analyticDataByPost);
  public data = signal<ChartData<'line'> | null>(null);
  public isAnalyticLoaded = linkedSignal({
    computation: () => this.analyticDataByPost() !== null,
    source: this.analyticDataByPost,
  });
  public maxDate = DEFAULT_END_DATE;
  public postCreatedAt = input<string>('');
  public minDate = computed(() => {
    const createdAt = new Date(this.postCreatedAt());
    createdAt.setHours(0, 0, 0, 0);
    return createdAt;
  });
  public options: ChartOptions = {};
  public platformId = inject(PLATFORM_ID);
  public redrawChart = output<string[]>();
  public selectedDates = signal<[Date, Date]>([DEFAULT_START_DATE, DEFAULT_END_DATE]);

  private buildChartData(data: PostViewDailyStatResponse[]): ChartData<'line'> {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColorTotal = documentStyle.getPropertyValue('--p-primary-500');
    const borderColorUnique = documentStyle.getPropertyValue('--p-green-500');

    const allDates = new Set<string>(data.map((item) => item.date));
    const sortedDates = Array.from(allDates).sort();

    const totalViewsData = sortedDates.map((date) => data.find((item) => item.date === date)?.totalViews ?? 0);
    const uniqueViewsData = sortedDates.map((date) => data.find((item) => item.date === date)?.uniqueViews ?? 0);

    const labels = sortedDates.map((dateStr) => {
      const date = new Date(dateStr);
      return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth() + 1}`;
    });

    const datasets = [
      {
        ...BASE_DATASET,
        backgroundColor: `${borderColorTotal}11`,
        borderColor: borderColorTotal,
        data: totalViewsData,
        label: 'Total',
        pointBackgroundColor: `${borderColorTotal}11`,
        pointBorderColor: borderColorTotal,
      },
      {
        ...BASE_DATASET,
        backgroundColor: `${borderColorUnique}11`,
        borderColor: borderColorUnique,
        data: uniqueViewsData,
        label: 'Unique',
        pointBackgroundColor: `${borderColorUnique}11`,
        pointBorderColor: borderColorUnique,
      },
    ];

    return {
      datasets,
      labels,
    };
  }

  private checkInitialStartDate(): void {
    const postCreatedAt = new Date(this.postCreatedAt());

    if (DEFAULT_START_DATE.getTime() < postCreatedAt.getTime()) {
      this.selectedDates.update(() => [postCreatedAt, DEFAULT_END_DATE]);
    }
  }

  private initChart(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkInitialStartDate();
      this.setChartOptions();
      this.updateChart();
    }
  }

  private initializeFromQueryParams(): void {
    const query = this.navigationService.queryParams();
    const startDate = query['start'] ? new Date(query['start']) : DEFAULT_START_DATE;
    const endDate = query['end'] ? new Date(query['end']) : DEFAULT_END_DATE;

    if (startDate instanceof Date && !isNaN(startDate.getTime())) {
      this.selectedDates.update(() => [startDate, endDate]);
    }
  }

  private setChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
    this.options = {
      aspectRatio: 1.6,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { size: 16 },
            pointStyle: 'line',
            pointStyleWidth: 24,
            usePointStyle: true,
          },
          position: 'top',
        },
        tooltip: {
          intersect: false,
          mode: 'index',
        },
      },
      responsive: true,
      scales: {
        x: {
          grid: { color: surfaceBorder },
          ticks: { autoSkip: false, color: textColorSecondary },
        },
        y: {
          beginAtZero: true,
          grid: { color: surfaceBorder },
          ticks: { color: textColorSecondary },
        },
      },
    };
  }

  private setupReactiveUpdates(): void {
    this.analyticDataByPost$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateChart();
    });
  }

  private updateChart(): void {
    const data = this.analyticDataByPost();
    if (!data?.length) {
      this.data.set(null);
      return;
    }

    const chartData = this.buildChartData(data);
    this.data.set(chartData);
  }

  public ngOnInit(): void {
    this.initializeFromQueryParams();
    this.setupReactiveUpdates();
    this.initChart();
  }

  public onDateSelectHandler(): void {
    const [start, end] = this.selectedDates();

    if (start instanceof Date && end instanceof Date) {
      const startUTC = toUTCDateString(start);
      const endUTC = toUTCDateString(end);
      this.isAnalyticLoaded.set(false);
      this.redrawChart.emit([startUTC, endUTC]);
    }
  }
}
