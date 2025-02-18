import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, Observable, take, tap } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { ProfilesService } from '@/app/api/services/profiles/profiles.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly profilesService = inject(ProfilesService);
  private readonly message = inject(MessageService);

  public readonly currentProfile = signal<ProfilesResponse | null>(null);

  public createProfileMe(profileDto: FormData): Observable<ProfilesResponse> {
    return this.profilesService.createProfileMe(profileDto).pipe(
      take(1),
      tap((profile: ProfilesResponse) => {
        this.currentProfile.set(profile);
        this.message.success(MESSAGE.CREATE_PROFILE_SUCCESS);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public getMe(): Observable<ProfilesResponse | null> {
    return this.profilesService.getMe().pipe(
      take(1),
      tap((profile: ProfilesResponse | null) => {
        this.currentProfile.set(profile);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public updateProfileMe(profileDto: FormData): Observable<ProfilesResponse> {
    return this.profilesService.updateProfileMe(profileDto).pipe(
      take(1),
      tap((profile: ProfilesResponse) => {
        this.currentProfile.set(profile);
        this.message.success(MESSAGE.UPDATE_PROFILE_SUCCESS);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public deleteProfileMe(): Observable<ProfilesResponse> {
    return this.profilesService.deleteProfileMe().pipe(
      take(1),
      tap(() => {
        this.currentProfile.set(null);
        this.message.success(MESSAGE.DELETE_PROFILE_SUCCESS);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.profilesService.checkUsernameAvailability(username).pipe(
      take(1),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  private handleError(error: OverriddenHttpErrorResponse): Observable<never> {
    this.message.error(error.error.message);
    return EMPTY;
  }
}
