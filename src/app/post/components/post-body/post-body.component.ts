import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { marked } from 'marked';

import { PostResponse } from '@/app/api/schemas/posts-response';

@Component({
  animations: [
    trigger('postBody', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scaleY(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scaleY(1)', transformOrigin: 'top' }),
        animate('300ms ease-out', style({ opacity: 0, transform: 'scaleY(0)' })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
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
