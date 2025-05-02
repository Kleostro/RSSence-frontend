import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
// eslint-disable-next-line max-len
import { ProfileFormWrapperComponent } from '@/app/profile/components/profile-form-wrapper/profile-form-wrapper.component';
import { ProfileInfoComponent } from '@/app/profile/components/profile-info/profile-info.component';
import { FORM_STATE, FormState } from '@/app/profile/constants/profile-form';
import { ProfileFacadeService } from '@/app/profile/services/profile-facade/profile-facade.service';
import { PageLoaderComponent } from '@/app/shared/components/page-loader/page-loader.component';

@Component({
  selector: 'app-profile',
  imports: [ProfileFormWrapperComponent, ProfileInfoComponent, ButtonModule, RippleModule, PageLoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnDestroy {
  public userId = input<string | null>(null, { alias: 'id' });

  private readonly facade = inject(ProfileFacadeService);
  private readonly userService = inject(UserService);
  public readonly loaderService = inject(LoaderService);
  public readonly navigationService = inject(NavigationService);

  private readonly destroy$ = new Subject<void>();

  public isMyPage = signal<boolean>(false);

  public currentProfile = signal<ProfilesResponse | null>(null);
  public profileForPreview = signal<ProfilesResponse | null>(null);

  public readonly FORM_STATE = FORM_STATE;
  public profileFormState = signal<FormState>(FORM_STATE.CREATE);

  public navigationItems = this.facade.getNavigationItems(
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

  constructor() {
    toObservable(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userId) => {
        const parsedUserId = this.navigationService.parseUserId(userId);
        this.loadInitialData(parsedUserId);
      });
  }

  private loadInitialData(userId: number | null): void {
    this.facade
      .loadInitialData(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentUser) => {
        const me = this.userService.me();
        this.isMyPage.set(!userId || me?.id === userId);
        this.currentProfile.set(currentUser?.profile ?? null);
        this.profileForPreview.set(currentUser?.profile ?? null);
      });
  }

  public deleteProfile(): void {
    this.facade
      .deleteProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentProfile.set(null);
        this.profileForPreview.set(null);
      });
  }

  public handleProfileFormSubmit(newOrUpdatedProfile: ProfilesResponse): void {
    this.currentProfile.set(newOrUpdatedProfile);
    this.profileForPreview.set(newOrUpdatedProfile);
    this.profileFormState.set(FORM_STATE.CREATE);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
