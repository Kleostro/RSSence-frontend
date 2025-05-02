import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';
import { AuthorPreviewComponent } from '@/app/author/components/author-preview/author-preview.component';

@Component({
  selector: 'app-author-info',
  imports: [SpeedDialModule, ButtonModule, RippleModule, AuthorPreviewComponent],
  templateUrl: './author-info.component.html',
  styleUrl: './author-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorInfoComponent {
  public isMyPage = input.required<boolean>();
  public currentAuthor = input.required<AuthorsResponse | null>();
  public navigationItems = input.required<MenuItem[]>();

  @Output() public navigateToProfile = new EventEmitter<number>();
}
