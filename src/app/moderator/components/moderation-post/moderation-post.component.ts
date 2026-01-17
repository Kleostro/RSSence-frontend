import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { PostResponse } from '@/app/api/schemas/post/posts-response';
import { UsersService } from '@/app/api/services/users/users.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';
import { PostAvatarComponent } from '@/app/post/components/post-avatar/post-avatar.component';
import { PostBodyComponent } from '@/app/post/components/post-body/post-body.component';
import { PostFooterComponent } from '@/app/post/components/post-footer/post-footer.component';
import { TimeAgoPipe } from '@/app/shared/pipes/time-ago.pipe';
import { ModalService } from '@/app/shared/services/modal/modal.service';

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
  imports: [
    CoauthorsListComponent,
    TimeAgoPipe,
    PostBodyComponent,
    PostFooterComponent,
    ButtonModule,
    RippleModule,
    PostAvatarComponent,
    TooltipModule,
  ],
  selector: 'app-moderation-post',
  styleUrl: './moderation-post.component.scss',
  templateUrl: './moderation-post.component.html',
})
export class ModerationPostComponent {
  public readonly modalService = inject(ModalService);
  public readonly navigationService = inject(NavigationService);

  public readonly usersService = inject(UsersService);
  public isProcessing = signal<boolean>(false);
  public isShortCoauthors = signal<boolean>(true);
  public post = input.required<null | PostResponse>();

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
}
