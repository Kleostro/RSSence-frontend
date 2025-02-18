import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';

@Component({
  selector: 'app-profile-header',
  imports: [DatePipe, AvatarModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent {
  public profile = input.required<ProfilesResponse | null>();
}
