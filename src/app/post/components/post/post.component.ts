import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import hljs from 'highlight.js';
import * as marked from 'marked';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { concatMap, finalize, Subject, takeUntil } from 'rxjs';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { PostResponse } from '@/app/api/schemas/posts-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';
import { PostService } from '@/app/post/services/post/post.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CoauthorsListComponent, NgIf, ButtonModule, RippleModule, PostAvatarComponent],
  selector: 'app-post',
  styleUrl: './post.component.scss',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly postService = inject(PostService);
  public readonly sanitizer = inject(DomSanitizer);

  public readonly userService = inject(UserService);
  public author = input.required<AuthorsResponse | null>();
  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public isShowPostActions = input<boolean>(true);
  public mode = signal<'full' | 'preview'>('preview');
  public post = input.required<null | PostResponse>();

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

  // TBD: fix deleting a post on the detailed page of a post
  public deletePost(post: PostResponse): void {
    this.isProcessing.set(true);
    this.postService
      .deletePost(post.id)
      .pipe(
        concatMap(() => this.postService.refreshPosts()),
        takeUntil(this.destroy$),
        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.parseHtml();
  }
}
