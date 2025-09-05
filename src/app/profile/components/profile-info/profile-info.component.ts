import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';

import { ProfileResponse } from '@/app/api/schemas/profiles-response';
import { ProfilePreviewComponent } from '@/app/profile/components/profile-preview/profile-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpeedDialModule, ButtonModule, RippleModule, ProfilePreviewComponent],
  selector: 'app-profile-info',
  styleUrl: './profile-info.component.scss',
  templateUrl: './profile-info.component.html',
})
export class ProfileInfoComponent {
  @Output() public navigateToAuthor = new EventEmitter<null | string>();
  public currentAuthorUsername = input<null | string>(null);
  public currentProfile = input.required<null | ProfileResponse>();
  public isMyPage = input<boolean>(true);
  public navigationItems = input<MenuItem[]>([]);
}
