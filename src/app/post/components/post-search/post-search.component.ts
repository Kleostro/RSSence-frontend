import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Params } from '@angular/router';

import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

import { TIME } from '@/app/constants/time';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

const DEBOUNCE_TIME = TIME.SECOND;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputText, RadioButton, ReactiveFormsModule],
  selector: 'app-post-search',
  styleUrl: './post-search.component.scss',
  templateUrl: './post-search.component.html',
})
export class PostSearchComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly navigationService = inject(NavigationService);
  public readonly searchFields = [
    { label: 'Title', placeholder: 'A very interesting title', value: 'title' },
    { label: 'Content', placeholder: 'Lorem ipsum dolor sit amet', value: 'content' },
    { label: 'Authors', placeholder: 'john_doe, stardustmeg, kleostro', value: 'username' },
  ];
  private initialSelectedSearchField = computed(() => {
    return (
      this.searchFields.find((field) => field.value === this.navigationService.queryParams()['searchField']) ??
      this.searchFields[0]
    );
  });
  public readonly searchForm = this.fb.group({
    search: [this.navigationService.queryParams()['search'] ?? ''],
    searchField: [this.initialSelectedSearchField().value],
  });

  public inputPlaceholder = signal<string>(this.initialSelectedSearchField().placeholder);
  public searchEvent = output<Params>();

  public ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap(({ search, searchField }) => {
          const params = { search, searchField };
          this.searchEvent.emit(params);
        }),
      )
      .subscribe();
  }
}
