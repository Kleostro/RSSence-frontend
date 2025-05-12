import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { SpeedDialModule } from 'primeng/speeddial';

import { AuthorResponse } from '@/app/api/schemas/authors-response';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarModule, SpeedDialModule],
  selector: 'app-author-preview',
  styleUrl: './author-preview.component.scss',
  templateUrl: './author-preview.component.html',
})
export class AuthorPreviewComponent {
  public author = input.required<null | Partial<AuthorResponse>>();
}
