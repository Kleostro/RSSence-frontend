import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Params } from '@angular/router';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButton } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

import { AuthorContributions } from '@/app/api/interfaces/author/author-contributions';
import { PostStatuses } from '@/app/api/interfaces/post/post-statuses';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { parseBooleanParam } from '@/app/utils/parse-boolean-param';

const DEBOUNCE_TIME = 1000;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RadioButton, CheckboxModule, BadgeModule, ButtonModule, RippleModule],
  selector: 'app-post-filter',
  styleUrl: './post-filter.component.scss',
  templateUrl: './post-filter.component.html',
})
export class PostFilterComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly navigationService = inject(NavigationService);
  private initialAuthorship = computed(() => {
    return parseBooleanParam(this.navigationService.queryParams()['isMainAuthor']);
  });

  private initialAuthorship$ = toObservable(this.initialAuthorship);

  private initialSelectedStatuses = computed(() => {
    const urlStatus = this.navigationService.queryParams()['status'];
    if (!urlStatus) {
      return [];
    }

    return Array.isArray(urlStatus) ? urlStatus : [urlStatus];
  });
  private initialSelectedStatuses$ = toObservable(this.initialSelectedStatuses);

  public readonly filterForm = this.fb.group<{ isMainAuthor: boolean | undefined; status: string | string[] }>({
    isMainAuthor: undefined,
    status: [''],
  });
  public contributionStats = input<AuthorContributions[]>([]);

  public filterEvent = output<Params>();
  public statusOptions = input<PostStatuses[]>([]);

  public ngOnInit(): void {
    this.initialSelectedStatuses$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((statuses) => {
          this.filterForm.patchValue({ status: statuses });
        }),
      )
      .subscribe();

    this.initialAuthorship$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((authorship) => {
          this.filterForm.patchValue({ isMainAuthor: authorship });
        }),
      )
      .subscribe();

    this.filterForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap((formValue) => {
          const params = { isMainAuthor: formValue.isMainAuthor, status: formValue.status };
          this.filterEvent.emit(params);
        }),
      )
      .subscribe();
  }

  public resetStatusFilter(): void {
    this.filterForm.patchValue({ status: [] });
    this.navigationService.updateQueryParams({ status: [] });
  }
}
