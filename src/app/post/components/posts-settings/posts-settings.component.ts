import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Params } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { AuthorContributions } from '@/app/api/interfaces/author/author-contributions';
import { PostStatuses } from '@/app/api/interfaces/post/post-statuses';
import MODAL_POSITION_DIRECTION from '@/app/constants/modal-position';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { PostFilterComponent } from '@/app/post/components/post-filter/post-filter.component';
import { PostFormComponent } from '@/app/post/components/post-form/post-form.component';
import { PostSearchComponent } from '@/app/post/components/post-search/post-search.component';
import { PostSortingOrderComponent } from '@/app/post/components/post-sorting-order/post-sorting-order.component';
import { PostSortingComponent } from '@/app/post/components/post-sorting/post-sorting.component';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PostSearchComponent,
    PostSortingComponent,
    PostSortingOrderComponent,
    PostFilterComponent,
    ButtonModule,
    RippleModule,
    PostFormComponent,
  ],
  selector: 'app-posts-settings',
  styleUrl: './posts-settings.component.scss',
  templateUrl: './posts-settings.component.html',
})
export class PostsSettingsComponent {
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);
  public canCreatePost = input<boolean>(false);
  public contributionStats = input<AuthorContributions[]>([]);
  public statusOptions = input<PostStatuses[]>([]);

  public onCreatePost(postStatus: string): void {
    this.modalService.closeModal();
    this.navigationService.updateQueryParams({ status: [postStatus] });
  }

  public setParamsInModal(): void {
    this.modalService.position.set(MODAL_POSITION_DIRECTION.CENTER);
  }

  public settingsHandler(event: Params): void {
    this.navigationService.updateQueryParams(event);
  }
}
