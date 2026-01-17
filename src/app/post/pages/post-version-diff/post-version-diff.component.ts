import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { catchError, EMPTY, tap } from 'rxjs';

import { PostVersionDiffResponse } from '@/app/api/schemas/post/post-version-diff-response';
import { PostVersionsService } from '@/app/api/services/posts/services/post-versions.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

@Component({
  animations: [
    trigger('boxCollapse', [
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
  imports: [ButtonModule, RippleModule],
  selector: 'app-post-version-diff',
  styleUrl: './post-version-diff.component.scss',
  templateUrl: './post-version-diff.component.html',
})
export class PostVersionDiffComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postVersionsService = inject(PostVersionsService);
  public readonly navigationService = inject(NavigationService);
  public collapsedBoxes = signal<Set<string>>(new Set());

  public currentPostVersionDiff = signal<null | PostVersionDiffResponse | undefined>(undefined);

  public postId = input<null | string>(null, { alias: 'id' });

  public getPostVersionDiff(): void {
    const postId = this.postId();
    const from = +this.navigationService.queryParams()['from'];
    const to = +this.navigationService.queryParams()['to'];

    if (postId) {
      this.postVersionsService
        .getPostVersionDiff(+postId, from, to)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((versions: PostVersionDiffResponse) => {
            this.currentPostVersionDiff.set(versions);
          }),
          catchError(() => {
            this.navigationService.goBack();
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  public isBoxCollapsed(boxId: string): boolean {
    return this.collapsedBoxes().has(boxId);
  }

  public ngOnInit(): void {
    this.getPostVersionDiff();
  }

  public toggleBox(boxId: string): void {
    const current = this.collapsedBoxes();
    const updated = new Set(current);

    if (updated.has(boxId)) {
      updated.delete(boxId);
    } else {
      updated.add(boxId);
    }

    this.collapsedBoxes.set(updated);
  }
}
