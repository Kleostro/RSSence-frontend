import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { ProfilePreviewComponent } from '@/app/profile/components/profile-preview/profile-preview.component';

@Component({
  selector: 'app-profile-info',
  imports: [SpeedDialModule, ButtonModule, RippleModule, ProfilePreviewComponent],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoComponent {
  public isMyPage = input.required<boolean>();
  public currentProfile = input.required<ProfilesResponse | null>();
  public navigationItems = input.required<MenuItem[]>();

  @Output() public navigateToAuthor = new EventEmitter<number>();
}
