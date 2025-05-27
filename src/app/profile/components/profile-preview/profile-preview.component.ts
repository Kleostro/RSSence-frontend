import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProfileResponse } from '@/app/api/schemas/profiles-response';
import { ProfileBioComponent } from '@/app/profile/components/profile-bio/profile-bio.component';
import { ProfileHeaderComponent } from '@/app/profile/components/profile-header/profile-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfileHeaderComponent, ProfileBioComponent],
  selector: 'app-profile-preview',
  styleUrl: './profile-preview.component.scss',
  templateUrl: './profile-preview.component.html',
})
export class ProfilePreviewComponent {
  public profile = input.required<null | ProfileResponse>();
}
