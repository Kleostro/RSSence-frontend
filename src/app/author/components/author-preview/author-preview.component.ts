import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { SpeedDialModule } from 'primeng/speeddial';

import { AuthorsResponse } from '@/app/api/schemas/authors-response';

@Component({
  selector: 'app-author-preview',
  imports: [AvatarModule, SpeedDialModule],
  templateUrl: './author-preview.component.html',
  styleUrl: './author-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorPreviewComponent {
  public author = input.required<AuthorsResponse | null>();
}
