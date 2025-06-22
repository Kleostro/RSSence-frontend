import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

import { ProfileResponse } from '@/app/api/schemas/profiles-response';
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
  @Output() public formSubmit = new EventEmitter<ProfileResponse>();
  @Output() public updateProfileForPreview = new EventEmitter<null | ProfileResponse>();

  public currentProfile = input.required<null | ProfileResponse>();
  public previewProfile = input.required<null | ProfileResponse>();
}
