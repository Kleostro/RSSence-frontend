import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { finalize, map, switchMap, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { POST_STATUS, PostResponse } from '@/app/api/schemas/post/posts-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { POST_ACTION } from '@/app/constants/post-action';
import { POST_FORM_FIELD_CONFIG } from '@/app/constants/post-form';
import { CoauthorsFGType, NewPost, PostForm } from '@/app/interfaces/post-form';
import { PostEditorComponent } from '@/app/post/components/post-editor/post-editor.component';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { arraysEqual } from '@/app/utils/arrays-equal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormFieldErrorComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TextareaModule,
    PostEditorComponent,
    FloatLabelModule,
    AutoCompleteModule,
    AvatarModule,
    EditorModule,
  ],
  selector: 'app-post-form',
  styleUrl: './post-form.component.scss',
  templateUrl: './post-form.component.html',
})
export class PostFormComponent implements OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly postsService = inject(PostsService);
  private readonly usersService = inject(UsersService);
  public filteredAuthors = signal<AuthorResponse[]>([]);
  public form!: FormGroup<PostForm>;
  public formSubmitEvent = output<string>();
  public hasChanges = signal<boolean>(false);
  public isProcessing = signal<boolean>(false);
  public post = input<null | PostResponse>();
  public POST_FORM_FIELD_CONFIG = POST_FORM_FIELD_CONFIG;
  public postEditor = viewChild.required<PostEditorComponent>('postEditor');

  private checkPostForChanges(postData: NewPost, status: string): void {
    const coauthorsInPostPreview = this.post()?.authors.filter((author) => !author.isMainAuthor) ?? [];
    const coauthorIdsInPostPreview = coauthorsInPostPreview.map(({ author }) => author.id);

    const contentUnchanged = this.post()?.content === postData.content;
    const titleUnchanged = this.post()?.title === postData.title;
    const coauthorsUnchanged = arraysEqual(coauthorIdsInPostPreview, postData.coauthorIds);

    if (contentUnchanged && titleUnchanged && coauthorsUnchanged) {
      this.hasChanges.set(false);
      this.formSubmitEvent.emit(status);
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

  private handleFormSubmit(postData: NewPost, isDraftPost: boolean): void {
    const post = this.post();
    const action$ = post ? this.postsService.updatePost(post.id, postData) : this.postsService.createPost(postData);
    action$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((newPost) => {
          if (isDraftPost) {
            return this.postsService.performPostAuthorAction(newPost.id, POST_ACTION.SAVE_AS_DRAFT);
          } else {
            return this.postsService.performPostAuthorAction(newPost.id, POST_ACTION.SUBMIT);
          }
        }),
        map(() => {
          this.form.reset();
          this.form.controls.coauthors.clear();
          this.formSubmitEvent.emit(isDraftPost ? POST_STATUS.DRAFT : POST_STATUS.SUBMITTED);
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
        takeUntilDestroyed(this.destroyRef),
        tap((data) => {
          this.filteredAuthors.set(data?.items.filter((author) => author.id !== authorMeId) ?? []);
        }),
      )
      .subscribe();
  }

  public getSubmitButtonLabel(): string {
    const currentPost = this.post();
    const isProcessing = this.isProcessing();

    if (currentPost) {
      return isProcessing ? 'Updating...' : 'Update';
    } else {
      return isProcessing ? 'Submiting...' : 'Submit';
    }
  }

  public initForm(): void {
    this.form = this.fb.group<PostForm>({
      coauthors: this.fb.array<CoauthorsFGType>([]),
      content: this.fb.control<string>(this.post()?.content ?? '', [
        Validators.required,
        Validators.minLength(this.POST_FORM_FIELD_CONFIG.content.min),
        Validators.maxLength(this.POST_FORM_FIELD_CONFIG.content.max),
      ]),
      title: this.fb.control<string>(this.post()?.title ?? '', [
        Validators.required,
        Validators.minLength(this.POST_FORM_FIELD_CONFIG.title.min),
        Validators.maxLength(this.POST_FORM_FIELD_CONFIG.title.max),
        Validators.pattern(this.POST_FORM_FIELD_CONFIG.title.pattern),
      ]),
    });
    const post = this.post();

    if (post) {
      this.postEditor().markdownContent.set(post.content);
      post.authors.forEach((author) => {
        if (!author.isMainAuthor) {
          this.addCoauthor(author.author);
        }
      });
    }
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public submit(isDraftPost: boolean): void {
    if (this.form.invalid) {
      return;
    }

    this.startProcessing();

    const postData = this.preparePostData(this.getCoauthorIds());
    const post = this.post();

    if (post) {
      this.checkPostForChanges(postData, post.status);
    } else {
      this.hasChanges.set(true);
    }

    if (this.hasChanges()) {
      this.handleFormSubmit(postData, isDraftPost);
    }
  }
}
