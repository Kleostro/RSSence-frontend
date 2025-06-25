import { DatePipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as marked from 'marked';
import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { finalize, Subject, takeUntil, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';
import MODAL_POSITION_DIRECTION from '@/app/shared/constants/modal-position';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { configurePostMarked } from '@/app/utils/configure-post-marked';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CoauthorsListComponent,
    NgIf,
    DatePipe,
    ButtonModule,
    Message,
    RippleModule,
    PostAvatarComponent,
    PostFormComponent,
  ],
  selector: 'app-post',
  styleUrl: './post.component.scss',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly navigationService = inject(NavigationService);
  private readonly postsService = inject(PostsService);
  @Output() public postDeleteEvent = new EventEmitter<unknown>();
  @Output() public postFormEvent = new EventEmitter<unknown>();
  public readonly modalService = inject(ModalService);
  public readonly sanitizer = inject(DomSanitizer);
  public readonly usersService = inject(UsersService);
  public deletePostConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('deletePostConfirm');
  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public isShowPostActions = input<boolean>(true);
  public mode = signal<'full' | 'preview'>('preview');
  public post = input.required<null | PostResponse>();
  public postForm = viewChild.required<TemplateRef<PostFormComponent>>('postForm');

  public safeHtml = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      this.parseHtml();
    });

    configurePostMarked();

    if (this.navigationService.isPostDetailedPage()) {
      this.mode.set('full');
    }
  }

  private async parseHtml(): Promise<string> {
    const parsedHtml = await marked.parse(this.post()?.content ?? '');
    this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(parsedHtml));
    return parsedHtml;
  }

  public deletePost(): void {
    const post = this.post();
    if (!post) {
      return;
    }
    this.isProcessing.set(true);
    this.postsService
      .deletePost(post.id)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.modalService.closeModal();
          if (this.navigationService.isPostDetailedPage()) {
            this.navigationService.goBack();
          } else {
            this.postDeleteEvent.emit();
          }
        }),
        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public editPost(): void {
    this.modalService.position.set(MODAL_POSITION_DIRECTION.CENTER_TOP);
    this.modalService.openModal(this.postForm(), `Update post: ${this.post()?.title}`);
  }

  public getAuthor(): AuthorResponse | null {
    return this.post()?.authors.find((author) => author.isMainAuthor)?.author ?? null;
  }

  public getCoauthors(): AuthorResponse[] {
    return (
      this.post()
        ?.authors.filter((postAuthor) => !postAuthor.isMainAuthor)
        .map((postAuthor) => postAuthor.author) ?? []
    );
  }

  public handlePostFormSubmit(): void {
    this.modalService.closeModal();
    this.postFormEvent.emit();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.parseHtml();
  }
}
