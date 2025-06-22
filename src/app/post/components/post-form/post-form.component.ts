import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { finalize, map, Subject, take, takeUntil, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { PostEditorComponent } from '@/app/post/components/post-editor/post-editor.component';
import { CoauthorsFGType, NewPost, PostForm } from '@/app/post/interfaces/post-form';
import { arraysEqual } from '@/app/utils/arrays-equal';

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
  @Output() public formSubmitEvent = new EventEmitter<PostResponse>();
  @Input() public post: null | PostResponse = null;
  public filteredAuthors = signal<AuthorResponse[]>([]);
  public form!: FormGroup<PostForm>;
  public hasChanges = signal<boolean>(false);
  public isProcessing = signal<boolean>(false);
  public postEditor = viewChild.required<PostEditorComponent>('postEditor');

  private checkPostForChanges(postData: NewPost): void {
    const coauthorsInPostPreview = this.post?.authors.filter((author) => !author.isMainAuthor) ?? [];
    const coauthorIdsInPostPreview = coauthorsInPostPreview.map(({ author }) => author.id);

    const contentUnchanged = this.post?.content === postData.content;
    const titleUnchanged = this.post?.title === postData.title;
    const coauthorsUnchanged = arraysEqual(coauthorIdsInPostPreview, postData.coauthorIds);

    if (contentUnchanged && titleUnchanged && coauthorsUnchanged) {
      this.hasChanges.set(false);
      this.formSubmitEvent.emit();
      this.completeProcessing();
    } else {
      this.hasChanges.set(true);
    }
  }

  private completeProcessing(): void {
    this.isProcessing.set(false);
    this.form.enable();
  }

  private getCoauthorIds(): number[] {
    const coauthorsSet = new Set(
      this.form.controls.coauthors.controls
        .map((coauthor) => coauthor.value.coauthor)
        .filter(
          (coauthor): coauthor is AuthorResponse =>
            coauthor !== null && coauthor !== undefined && typeof coauthor !== 'string',
        ),
    );

    const coauthorsArray = Array.from(coauthorsSet);
    return coauthorsArray.map((coauthor: AuthorResponse) => coauthor.id);
  }

  private handleFormSubmit(postData: NewPost): void {
    const action$ = this.post
      ? this.postsService.updatePost(this.post.id, postData)
      : this.postsService.createPost(postData);
    action$
      .pipe(
        take(1),
        map((newPost: PostResponse) => {
          this.form.reset();
          this.form.controls.coauthors.clear();

          this.formSubmitEvent.emit(newPost);
        }),
        finalize(() => {
          this.completeProcessing();
        }),
      )

      .subscribe();
  }

  private preparePostData(coauthorIds: number[]): NewPost {
    const formValue = this.form.getRawValue();
    return {
      coauthorIds,
      content: formValue.content,
      title: formValue.title,
    };
  }

  private startProcessing(): void {
    this.isProcessing.set(true);
    this.form.disable();
  }

  public addCoauthor(coauthor: AuthorResponse | null = null): void {
    this.form.controls.coauthors.push(this.fb.group({ coauthor: this.fb.control<AuthorResponse | null>(coauthor) }));
  }

  public filterAuthors(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    const authorMeId = this.usersService.me()?.author?.id;

    this.authorsService
      .getAuthors({ search: query, searchField: 'username' })
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => {
          this.filteredAuthors.set(data?.items.filter((author) => author.id !== authorMeId) ?? []);
        }),
      )
      .subscribe();
  }

  public getSubmitButtonLabel(): string {
    const currentPost = this.post;
    const isProcessing = this.isProcessing();

    if (currentPost) {
      return isProcessing ? 'Saving...' : 'Save';
    } else {
      return isProcessing ? 'Posting...' : 'Post';
    }
  }

  public initForm(): void {
    const MAX_LENGTH = 100;
    this.form = this.fb.group<PostForm>({
      coauthors: this.fb.array<CoauthorsFGType>([]),
      content: this.fb.control<null | string>(this.post?.content ?? ''),
      title: this.fb.control<string>(this.post?.title ?? '', [Validators.required, Validators.maxLength(MAX_LENGTH)]),
    });

    if (this.post) {
      this.postEditor().markdownContent.set(this.post.content);
      this.post.authors.forEach((author) => {
        if (!author.isMainAuthor) {
          this.addCoauthor(author.author);
        }
      });
    }
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
    if (this.post) {
      this.checkPostForChanges(postData);
    } else {
      this.hasChanges.set(true);
    }

    if (this.hasChanges()) {
      this.handleFormSubmit(postData);
    }
  }
}
