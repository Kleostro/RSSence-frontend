import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { ProfileFormComponent } from '@/app/profile/components/profile-form/profile-form.component';
import { ProfilePreviewComponent } from '@/app/profile/components/profile-preview/profile-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfilePreviewComponent, ProfileFormComponent],
  selector: 'app-profile-form-wrapper',
  styleUrl: './profile-form-wrapper.component.scss',
  templateUrl: './profile-form-wrapper.component.html',
})
export class ProfileFormWrapperComponent {
  @Output() public backToProfilePage = new EventEmitter<void>();
  @Output() public formSubmit = new EventEmitter<ProfilesResponse>();
  @Output() public updateProfileForPreview = new EventEmitter<null | ProfilesResponse>();

  public currentProfile = input.required<null | ProfilesResponse>();
  public profileForPreview = input.required<null | ProfilesResponse>();
}
