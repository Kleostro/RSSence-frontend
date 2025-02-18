import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { ProfileFormComponent } from '@/app/profile/components/profile-form/profile-form.component';
import { ProfilePreviewComponent } from '@/app/profile/components/profile-preview/profile-preview.component';
import { FORM_STATE, FormState } from '@/app/profile/constants/profile-form';
import { ProfileService } from '@/app/profile/services/profile/profile.service';

@Component({
  selector: 'app-profile-me',
  imports: [ProfileFormComponent, ProfilePreviewComponent, ButtonModule],
  templateUrl: './profile-me.component.html',
  styleUrl: './profile-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMeComponent implements OnInit {
  public readonly profileService = inject(ProfileService);
  public readonly loaderService = inject(LoaderService);

  public profileForPreview = signal<ProfilesResponse | null>(null);

  public isProcessing = signal(false);
  public formState = signal<FormState>(FORM_STATE.CREATE);

  public readonly FORM_STATE = FORM_STATE;

  public ngOnInit(): void {
    this.loaderService.turnOn();
    this.profileService
      .getMe()
      .pipe(
        finalize(() => {
          this.profileForPreview.set(this.profileService.currentProfile());
          this.loaderService.turnOff();
        }),
      )
      .subscribe();
  }

  public deleteProfile(): void {
    this.loaderService.turnOn();
    this.isProcessing.set(true);
    this.profileService
      .deleteProfileMe()
      .pipe(
        finalize(() => {
          this.loaderService.turnOff();
          this.isProcessing.set(false);
          this.profileForPreview.set(this.profileService.currentProfile());
        }),
      )
      .subscribe();
  }

  public handleFormSubmit(formData: FormData): void {
    this.loaderService.turnOn();
    if (this.formState() === FORM_STATE.UPDATE) {
      this.profileService
        .updateProfileMe(formData)
        .pipe(
          finalize(() => {
            this.loaderService.turnOff();
            this.formState.set(FORM_STATE.CREATE);
            this.profileForPreview.set(this.profileService.currentProfile());
          }),
        )
        .subscribe();
    } else {
      this.profileService
        .createProfileMe(formData)
        .pipe(
          finalize(() => {
            this.loaderService.turnOff();
            this.profileForPreview.set(this.profileService.currentProfile());
          }),
        )
        .subscribe();
    }
  }
}
