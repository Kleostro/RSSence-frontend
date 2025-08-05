import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

import { PostsService } from '@/app/api/services/posts/posts.service';

const DEBOUNCE_TIME = 400;

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
  private readonly postsService = inject(PostsService);
  public readonly searchFields = [
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ];
  public readonly searchForm = this.fb.group({
    search: [''],
    searchField: [this.searchFields[0].value],
  });

  public ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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
