import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import hljs from 'highlight.js';
import * as marked from 'marked';
import { MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { finalize, Subject, takeUntil, tap } from 'rxjs';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';
import { getPostActions } from '@/app/post/constants/post-actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CoauthorsListComponent, NgIf, ButtonModule, RippleModule, PostAvatarComponent, SpeedDialModule],
  selector: 'app-post',
  styleUrl: './post.component.scss',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly navigationService = inject(NavigationService);
  private readonly postsService = inject(PostsService);
  @Output() public postDeleteEvent = new EventEmitter<unknown>();
  public readonly sanitizer = inject(DomSanitizer);
  public readonly usersService = inject(UsersService);
  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public isShowPostActions = input<boolean>(true);
  public mode = signal<'full' | 'preview'>('preview');
  public post = input.required<null | PostResponse>();

  public postActionsItems = getPostActions(
    (event: MenuItemCommandEvent) => {
      event.originalEvent?.stopPropagation();
    },
    (event: MenuItemCommandEvent) => {
      event.originalEvent?.stopPropagation();
      this.deletePost();
    },
  );
  public safeHtml = signal<SafeHtml>('');

  constructor() {
    this.configureMarked();
  }

  private configureMarked(): void {
    marked.use({
      breaks: true,
      gfm: true,
      pedantic: false,
      renderer: {
        code: this.renderCodeBlock.bind(this),
        image: this.renderImage.bind(this),
      },
    });
  }

  private async parseHtml(): Promise<string> {
    const parsedHtml = await marked.parse(this.post()?.content ?? '');
    this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(parsedHtml));
    return parsedHtml;
  }

  private renderCodeBlock(token: marked.Tokens.Code): string {
    const validLanguage = token.lang && hljs.getLanguage(token.lang) ? token.lang : 'plaintext';
    return `
          <pre>
            <code class="hljs ${token.lang ?? 'text'}">
              ${hljs.highlight(token.text, { language: validLanguage }).value}
            </code>
          </pre>
        `;
  }

  private renderImage(token: marked.Tokens.Image): string {
    return `
          <img
            style="max-width: 100%; height: auto;"
            src="${token.href}"
            alt="${token.text}"
            title="${token.title ?? token.text}""
          />
        `;
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.parseHtml();
  }
}
