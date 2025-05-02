import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { ProfileFormComponent } from '@/app/profile/components/profile-form/profile-form.component';
import { ProfilePreviewComponent } from '@/app/profile/components/profile-preview/profile-preview.component';

@Component({
  selector: 'app-profile-form-wrapper',
  imports: [ProfilePreviewComponent, ProfileFormComponent],
  templateUrl: './profile-form-wrapper.component.html',
  styleUrl: './profile-form-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormWrapperComponent {
  public currentProfile = input.required<ProfilesResponse | null>();
  public profileForPreview = input.required<ProfilesResponse | null>();

  @Output() public backToProfilePage = new EventEmitter<void>();
  @Output() public formSubmit = new EventEmitter<ProfilesResponse>();
  @Output() public updateProfileForPreview = new EventEmitter<ProfilesResponse | null>();
}
