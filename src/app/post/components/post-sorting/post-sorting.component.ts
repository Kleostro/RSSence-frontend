import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Params } from '@angular/router';

import { RadioButton } from 'primeng/radiobutton';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

import { NavigationService } from '@/app/core/services/navigation/navigation.service';

const DEBOUNCE_TIME = 500;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RadioButton],
  selector: 'app-post-sorting',
  styleUrl: './post-sorting.component.scss',
  templateUrl: './post-sorting.component.html',
})
export class PostSortingComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly navigationService = inject(NavigationService);
  public readonly sortByOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Creation date', value: 'createdAt' },
    { label: 'Last updated date', value: 'updatedAt' },
  ];

  private initialSelectedSortField = computed(() => {
    return (
      this.sortByOptions.find((field) => field.value === this.navigationService.queryParams()['sortBy']) ??
      this.sortByOptions[1]
    );
  });

  public readonly sortingForm = this.fb.group({
    sortBy: [this.initialSelectedSortField().value],
  });

  public sortEvent = output<Params>();

  public ngOnInit(): void {
    this.sortingForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap((formValue) => {
          const params = { sortBy: formValue.sortBy };
          this.sortEvent.emit(params);
        }),
      )
      .subscribe();
  }
}
