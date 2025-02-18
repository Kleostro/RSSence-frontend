import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { ProfileBioComponent } from '@/app/profile/components/profile-bio/profile-bio.component';
import { ProfileHeaderComponent } from '@/app/profile/components/profile-header/profile-header.component';

@Component({
  selector: 'app-profile-preview',
  imports: [ProfileHeaderComponent, ProfileBioComponent],
  templateUrl: './profile-preview.component.html',
  styleUrl: './profile-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePreviewComponent {
  public profile = input.required<ProfilesResponse | null>();
}
