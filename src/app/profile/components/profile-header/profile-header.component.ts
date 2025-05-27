import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';

import { ProfileResponse } from '@/app/api/schemas/profiles-response';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, AvatarModule],
  selector: 'app-profile-header',
  styleUrl: './profile-header.component.scss',
  templateUrl: './profile-header.component.html',
})
export class ProfileHeaderComponent {
  public profile = input.required<null | ProfileResponse>();
}
