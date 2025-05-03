import { inject, Injectable } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { concatMap, finalize, map, Observable, of, tap } from 'rxjs';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { UsersResponse } from '@/app/api/schemas/users-response';
import { UserService } from '@/app/auth/services/user/user.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ProfileService } from '@/app/profile/services/profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileFacadeService {
  private readonly loaderService = inject(LoaderService);
  private readonly navigationService = inject(NavigationService);
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);

  public deleteProfile(): Observable<ProfilesResponse> {
    return this.profileService.deleteProfile().pipe(
      tap(() => {
        const previousMe = this.userService.me();
        if (previousMe) {
          this.userService.me.set({
            ...previousMe,
            profile: null,
          });
        }
      }),
    );
  }

  public getNavigationItems(
    navigateToAuthor: () => void,
    editProfile: () => void,
    deleteProfile: () => void,
  ): MenuItem[] {
    return [
      {
        command: navigateToAuthor,
        icon: 'pi pi-user',
        label: 'Author',
      },
      {
        command: editProfile,
        icon: 'pi pi-pencil',
        label: 'Edit',
      },
      {
        command: deleteProfile,
        icon: 'pi pi-trash',
        label: 'Delete',
      },
    ];
  }

  public handleProfileFormSubmit(formData: FormData, isUpdate: boolean): Observable<ProfilesResponse> {
    const action$ = isUpdate
      ? this.profileService.updateProfile(formData)
      : this.profileService.createProfile(formData);

    return action$.pipe(
      tap((updatedOrNewProfile) => {
        const previousMe = this.userService.me();
        if (previousMe) {
          this.userService.me.set({
            ...previousMe,
            profile: updatedOrNewProfile,
          });
        }
      }),
    );
  }

  public loadInitialData(userId: null | number): Observable<null | UsersResponse> {
    this.loaderService.turnOnPageLoading();
    return this.userService.getMe().pipe(
      concatMap((userMe) => {
        if (userId && userMe?.id === userId) {
          return of(userMe);
        }

        if (userId) {
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

        return of(userMe ?? null);
      }),
      finalize(() => {
        this.loaderService.turnOffPageLoading();
      }),
    );
  }
}
