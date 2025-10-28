import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { marked } from 'marked';

import { PostResponse } from '@/app/api/schemas/post/posts-response';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-post-body',
  styleUrl: './post-body.component.scss',
  templateUrl: './post-body.component.html',
})
export class PostBodyComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  public post = input<null | PostResponse>(null);

  public safeHtml = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      this.parseHtml();
    });
  }

  private async parseHtml(): Promise<string> {
    const parsedHtml = await marked.parse(this.post()?.content ?? '');
    this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(parsedHtml));
    return parsedHtml;
  }

  public ngOnInit(): void {
    this.parseHtml();
  }
}
