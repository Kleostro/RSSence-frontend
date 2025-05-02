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
  selector: 'app-post-form',
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
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent implements OnInit {
  @Input({ required: true }) public authors: AuthorsResponse[] = [];

  @Output() public createPostEvent = new EventEmitter<PostsResponse>();

  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly postService = inject(PostService);

  public form!: FormGroup<PostForm>;
  public filteredAuthors: AuthorsResponse[] = [];
  public isProcessing = signal<boolean>(false);

  public filterAuthors(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    const filteredAuthorsSet = new Set(
      this.authors.filter((author) => author.username.toLowerCase().includes(query)).map((author) => author),
    );

    this.filteredAuthors = Array.from(filteredAuthorsSet);
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.form = this.fb.group<PostForm>({
      title: this.fb.control<string>('', [Validators.required, Validators.maxLength(100)]),
      content: this.fb.control<string | null>(''),
      imageUrls: this.fb.array<ImageUrlsFGType>([]),
      coauthors: this.fb.array<CoauthorsFGType>([]),
    });
  }

  public addImageUrl(): void {
    this.form.controls.imageUrls.push(this.fb.group({ imageUrl: this.fb.control('') }));
  }

  public addCoauthor(): void {
    this.form.controls.coauthors.push(this.fb.group({ coauthor: this.fb.control<string | AuthorsResponse>('') }));
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.startProcessing();

    const postData = this.preparePostData(this.getCoauthorIds());
    this.sendPost(postData);
  }

  private startProcessing(): void {
    this.isProcessing.set(true);
    this.form.disable();
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
      title: formValue.title,
      content: formValue.content,
      imageUrls: [],
      coauthorIds,
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

  private completeProcessing(): void {
    this.isProcessing.set(false);
    this.form.enable();
  }
}
