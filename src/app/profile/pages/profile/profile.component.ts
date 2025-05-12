import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { catchError, EMPTY, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { UsersResponse } from '@/app/api/schemas/users-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
// eslint-disable-next-line max-len
import { ProfileFormWrapperComponent } from '@/app/profile/components/profile-form-wrapper/profile-form-wrapper.component';
import { ProfileInfoComponent } from '@/app/profile/components/profile-info/profile-info.component';
import { getNavigationProfilePage } from '@/app/profile/constants/navigation-profile-page';
import { FORM_STATE, FormState } from '@/app/profile/constants/profile-form';
import { ProfileService } from '@/app/profile/services/profile/profile.service';
import { PageLoaderComponent } from '@/app/shared/components/page-loader/page-loader.component';
import { MessageService } from '@/app/shared/services/message/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfileFormWrapperComponent, ProfileInfoComponent, ButtonModule, RippleModule, PageLoaderComponent],
  selector: 'app-profile',
  styleUrl: './profile.component.scss',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly message = inject(MessageService);
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);
  public readonly FORM_STATE = FORM_STATE;
  public readonly loaderService = inject(LoaderService);
  public readonly navigationService = inject(NavigationService);

  public currentProfile = signal<null | ProfilesResponse>(null);
  public isMyPage = signal<boolean>(false);
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
  public profileForPreview = signal<null | ProfilesResponse>(null);
  public userId = input<null | string>(null, { alias: 'id' });

  constructor() {
    toObservable(this.userId)
      .pipe(
        takeUntil(this.destroy$),
        map((userId) => this.navigationService.parseUserId(userId)),
        switchMap((parsedUserId) => this.handleUserLoad(parsedUserId)),
        tap((user) => {
          this.currentProfile.set(user?.profile ?? null);
          this.profileForPreview.set(user?.profile ?? null);
        }),

        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private handleUserLoad(userId: null | number): Observable<null | UsersResponse> {
    const me = this.userService.me();
    if (!userId) {
      this.isMyPage.set(true);
      return of(me ?? null);
    }
    if (me?.id === userId) {
      this.isMyPage.set(true);
      return of(me);
    }
    this.isMyPage.set(false);
    return this.userService.getUserById(userId).pipe(
      map((user) => {
        if (!user?.profile) {
          this.navigationService.navigateToNotFound();
          return null;
        }
        return user;
      }),
    );
  }

  public deleteProfile(): void {
    this.profileService
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
