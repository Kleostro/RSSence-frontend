import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';

import { PostsService } from '@/app/api/services/posts/posts.service';

const DEBOUNCE_TIME = 400;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputText, RadioButton, ReactiveFormsModule],
  selector: 'app-post-search',
  styleUrl: './post-search.component.scss',
  templateUrl: './post-search.component.html',
})
export class PostSearchComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly postsService = inject(PostsService);
  public readonly searchFields = [
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ];
  public readonly searchForm = this.fb.group({
    search: [''],
    searchField: [this.searchFields[0].value],
  });
  public isProcessing = signal<boolean>(false);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap((formFalue) => {
          this.postsService.query.update((q) => ({
            ...q,
            search: formFalue.search,
            searchField: formFalue.searchField,
          }));
        }),
      )
      .subscribe();
  }
}
