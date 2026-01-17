import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Params } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { fromEvent } from 'rxjs';

import { AuthorContributions } from '@/app/api/interfaces/author/author-contributions';
import { PostStatuses } from '@/app/api/interfaces/post/post-statuses';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostFilterComponent } from '@/app/post/components/post-filter/post-filter.component';
import { PostSearchComponent } from '@/app/post/components/post-search/post-search.component';
import { PostSortingOrderComponent } from '@/app/post/components/post-sorting-order/post-sorting-order.component';
import { PostSortingComponent } from '@/app/post/components/post-sorting/post-sorting.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PostSearchComponent,
    PostSortingComponent,
    PostSortingOrderComponent,
    PostFilterComponent,
    ButtonModule,
    RippleModule,
  ],
  selector: 'app-posts-settings',
  styleUrl: './posts-settings.component.scss',
  templateUrl: './posts-settings.component.html',
})
export class PostsSettingsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly el = inject(ElementRef<HTMLElement>);
  public readonly navigationService = inject(NavigationService);
  public contributionStats = input<AuthorContributions[]>([]);
  public isOpen = signal<boolean>(false);
  public statusOptions = input<PostStatuses[]>([]);

  constructor() {
    fromEvent(this.document, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: Event) => {
        if (
          this.isOpen() &&
          this.el.nativeElement instanceof HTMLElement &&
          event.target instanceof HTMLElement &&
          !this.el.nativeElement.contains(event.target)
        ) {
          this.isOpen.set(false);
        }
      });
  }

  public settingsHandler(event: Params): void {
    this.navigationService.updateQueryParams(event);
  }
}
