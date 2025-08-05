import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { RadioButton } from 'primeng/radiobutton';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

import { PostsService } from '@/app/api/services/posts/posts.service';

const DEBOUNCE_TIME = 400;

interface SortingForm {
  sortBy: FormControl<string>;
  sortOrder: FormControl<'asc' | 'desc'>;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RadioButton],
  selector: 'app-post-sort',
  styleUrl: './post-sort.component.scss',
  templateUrl: './post-sort.component.html',
})
export class PostSortComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly postsService = inject(PostsService);
  public readonly sortByOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Creation date', value: 'createdAt' },
    { label: 'Last updated date', value: 'updatedAt' },
  ];

  public readonly sortingForm = this.fb.group<SortingForm>({
    sortBy: this.fb.control(this.sortByOptions[0].value),
    sortOrder: this.fb.control('asc'),
  });

  public ngOnInit(): void {
    this.sortingForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap((formFalue) => {
          this.postsService.query.update((q) => ({
            ...q,
            sortBy: formFalue.sortBy,
            sortOrder: formFalue.sortOrder,
          }));
        }),
      )
      .subscribe();
  }
}
