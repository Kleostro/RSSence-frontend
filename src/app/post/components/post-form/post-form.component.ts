import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { finalize, map, take } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostsResponse } from '@/app/api/schemas/posts-response';
import { CoauthorsFGType, ImageUrlsFGType, NewPost, PostForm } from '@/app/post/interfaces/post-form';
import { PostService } from '@/app/post/services/post/post.service';

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
export class PostFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly postService = inject(PostService);

  @Input({ required: true }) public authors: AuthorsResponse[] = [];
  @Output() public createPostEvent = new EventEmitter<PostsResponse>();

  public filteredAuthors: AuthorsResponse[] = [];
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
    return coauthorsArray.map((coauthor: AuthorsResponse) => coauthor.id);
  }

  private preparePostData(coauthorIds: number[]): NewPost {
    const formValue = this.form.getRawValue();
    return {
      coauthorIds,
      content: formValue.content,
      imageUrls: [],
      title: formValue.title,
    };
  }

  private sendPost(postData: NewPost): void {
    this.postService
      .createPost(postData)
      .pipe(
        take(1),
        map((newPost: PostsResponse) => {
          this.form.reset();
          this.form.controls.coauthors.clear();
          this.form.controls.imageUrls.clear();
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
    this.form.controls.coauthors.push(this.fb.group({ coauthor: this.fb.control<AuthorsResponse | string>('') }));
  }

  public addImageUrl(): void {
    this.form.controls.imageUrls.push(this.fb.group({ imageUrl: this.fb.control('') }));
  }

  public filterAuthors(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    const filteredAuthorsSet = new Set(
      this.authors.filter((author) => author.username.toLowerCase().includes(query)).map((author) => author),
    );

    this.filteredAuthors = Array.from(filteredAuthorsSet);
  }

  public initForm(): void {
    const MAX_LENGTH = 100;
    this.form = this.fb.group<PostForm>({
      coauthors: this.fb.array<CoauthorsFGType>([]),
      content: this.fb.control<null | string>(''),
      imageUrls: this.fb.array<ImageUrlsFGType>([]),
      title: this.fb.control<string>('', [Validators.required, Validators.maxLength(MAX_LENGTH)]),
    });
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
