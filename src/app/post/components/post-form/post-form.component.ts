import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { finalize, map, Subject, take, takeUntil, tap } from 'rxjs';

import { AuthorResponse, PaginatedAuthorResponseSchema } from '@/app/api/schemas/authors-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { PostEditorComponent } from '@/app/post/components/post-editor/post-editor.component';
import { CoauthorsFGType, NewPost, PostForm } from '@/app/post/interfaces/post-form';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TextareaModule,
    PostEditorComponent,
    FloatLabelModule,
    NgIf,
    AutoCompleteModule,
    AvatarModule,
    EditorModule,
  ],
  selector: 'app-post-form',
  styleUrl: './post-form.component.scss',
  templateUrl: './post-form.component.html',
})
export class PostFormComponent implements OnDestroy, OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly postsService = inject(PostsService);
  private readonly usersService = inject(UsersService);

  @Output() public createPostEvent = new EventEmitter<PostResponse>();

  public filteredAuthors = signal<AuthorResponse[]>([]);
  public form!: FormGroup<PostForm>;
  public isProcessing = signal<boolean>(false);

  private completeProcessing(): void {
    this.isProcessing.set(false);
    this.form.enable();
  }

  private getCoauthorIds(): number[] {
    const coauthorsSet = new Set(
      this.form.controls.coauthors.controls
        .map((coauthor) => coauthor.value.coauthor)
        .filter((coauthor) => coauthor !== undefined && typeof coauthor !== 'string'),
    );

    const coauthorsArray = Array.from(coauthorsSet);
    return coauthorsArray.map((coauthor: AuthorResponse) => coauthor.id);
  }

  private preparePostData(coauthorIds: number[]): NewPost {
    const formValue = this.form.getRawValue();
    return {
      coauthorIds,
      content: formValue.content,
      title: formValue.title,
    };
  }

  private sendPost(postData: NewPost): void {
    this.postsService
      .createPost(postData)
      .pipe(
        take(1),
        map((newPost: PostResponse) => {
          this.form.reset();
          this.form.controls.coauthors.clear();
          this.createPostEvent.emit(newPost);
        }),
        finalize(() => {
          this.completeProcessing();
        }),
      )

      .subscribe();
  }

  private startProcessing(): void {
    this.isProcessing.set(true);
    this.form.disable();
  }

  public addCoauthor(): void {
    this.form.controls.coauthors.push(this.fb.group({ coauthor: this.fb.control<string>('') }));
  }

  public filterAuthors(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    const authorMeId = this.usersService.me()?.author?.id;

    this.authorsService
      .getAuthors({ search: query, searchField: 'username' })
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        tap((response) => {
          const { data, success } = PaginatedAuthorResponseSchema.safeParse(response);
          this.filteredAuthors.set(success ? data.items.filter((author) => author.id !== authorMeId) : []);
        }),
      )
      .subscribe();
  }

  public initForm(): void {
    const MAX_LENGTH = 100;
    this.form = this.fb.group<PostForm>({
      coauthors: this.fb.array<CoauthorsFGType>([]),
      content: this.fb.control<null | string>(''),
      title: this.fb.control<string>('', [Validators.required, Validators.maxLength(MAX_LENGTH)]),
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.startProcessing();

    const postData = this.preparePostData(this.getCoauthorIds());
    this.sendPost(postData);
  }
}
