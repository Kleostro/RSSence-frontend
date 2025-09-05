import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';

import { AuthorResponse } from '@/app/api/schemas/authors-response';
import { AuthorPreviewComponent } from '@/app/author/components/author-preview/author-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpeedDialModule, ButtonModule, RippleModule, AuthorPreviewComponent],
  selector: 'app-author-info',
  styleUrl: './author-info.component.scss',
  templateUrl: './author-info.component.html',
})
export class AuthorInfoComponent {
  public currentAuthor = input.required<AuthorResponse | null>();
  public currentProfileUsername = input<null | string>(null);
  public isMyPage = input<boolean>(true);
  public navigateToProfile = output<null | string>();
  public navigationItems = input<MenuItem[]>([]);
}
