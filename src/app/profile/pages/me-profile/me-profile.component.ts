import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ProfileResponse, ProfileSchema } from '@/app/api/schemas/profiles-response';
import { ProfilesService } from '@/app/api/services/profiles/profiles.service';
import { getNavigationProfilePage } from '@/app/constants/navigation-profile-page';
import { FORM_STATE, FormState } from '@/app/constants/profile-form';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
// eslint-disable-next-line max-len
import { ProfileFormWrapperComponent } from '@/app/profile/components/profile-form-wrapper/profile-form-wrapper.component';
import { ProfileInfoComponent } from '@/app/profile/components/profile-info/profile-info.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfileFormWrapperComponent, ProfileInfoComponent],
  selector: 'app-me-profile',
  styleUrl: './me-profile.component.scss',
  templateUrl: './me-profile.component.html',
})
export class MeProfileComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly profilesService = inject(ProfilesService);
  private readonly route = inject(ActivatedRoute);
  public readonly FORM_STATE = FORM_STATE;
  public readonly navigationService = inject(NavigationService);

  public currentProfile = signal<null | ProfileResponse>(null);
  public profileFormState = signal<FormState>(FORM_STATE.CREATE);
  public navigationItems = getNavigationProfilePage(
    () => {
      this.navigationService.navigateToAuthor();
    },
    () => {
      this.profileFormState.set(FORM_STATE.UPDATE);
    },
    () => {
      this.deleteProfile();
    },
  );
  public previewProfile = signal<null | ProfileResponse>(null);

  public deleteProfile(): void {
    this.profilesService
      .deleteProfile(this.currentProfile()?.username ?? '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentProfile.set(null);
        this.previewProfile.set(null);
      });
  }

  public handleProfileFormSubmit(newOrUpdatedProfile: ProfileResponse): void {
    this.currentProfile.set(newOrUpdatedProfile);
    this.previewProfile.set(newOrUpdatedProfile);
    this.profileFormState.set(FORM_STATE.CREATE);
  }

  public ngOnInit(): void {
    const { data } = this.route.snapshot;
    if ('profile' in data) {
      const result = ProfileSchema.safeParse(data['profile']);
      this.currentProfile.set(result.data ?? null);
      this.previewProfile.set(result.data ?? null);
    }
  }
}
