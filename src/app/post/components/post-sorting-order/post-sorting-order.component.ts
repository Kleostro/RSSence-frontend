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
  selector: 'app-post-sorting-order',
  styleUrl: './post-sorting-order.component.scss',
  templateUrl: './post-sorting-order.component.html',
})
export class PostSortingOrderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly navigationService = inject(NavigationService);

  public readonly sortingOrderOptions = [
    { label: 'Ascending ↑', value: 'asc' },
    { label: 'Descending ↓', value: 'desc' },
  ];

  private initialSelectedSortingOrder = computed(() => {
    return (
      this.sortingOrderOptions.find((order) => order.value === this.navigationService.queryParams()['sortOrder']) ??
      this.sortingOrderOptions[0]
    );
  });

  public readonly sortingOrderForm = this.fb.group({
    sortingOrder: [this.initialSelectedSortingOrder().value],
  });

  public sortOrderEvent = output<Params>();

  public ngOnInit(): void {
    this.sortingOrderForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap((formValue) => {
          const params = { sortOrder: formValue.sortingOrder };
          this.sortOrderEvent.emit(params);
        }),
      )
      .subscribe();
  }
}
