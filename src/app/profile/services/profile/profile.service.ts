import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, finalize, Observable, take, tap, throwError } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { ProfilesService } from '@/app/api/services/profiles/profiles.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly loaderService = inject(LoaderService);
  private readonly message = inject(MessageService);
  private readonly profilesService = inject(ProfilesService);

  public allProfiles = signal<null | ProfilesResponse[]>(null);

  private handleError(error: OverriddenHttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  public checkUsernameAvailability(username: string): Observable<boolean | null> {
    return this.profilesService.checkUsernameAvailability(username).pipe(
      take(1),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public createProfile(profileDto: FormData): Observable<ProfilesResponse> {
    this.loaderService.turnOn();
    return this.profilesService.createProfile(profileDto).pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.CREATE_PROFILE_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public deleteProfile(): Observable<ProfilesResponse> {
    this.loaderService.turnOn();
    return this.profilesService.deleteProfile().pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.DELETE_PROFILE_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public findProfileByUserId(userId: number): null | ProfilesResponse {
    return this.allProfiles()?.find((profile) => profile.userId === userId) ?? null;
  }

  public getProfiles(): Observable<ProfilesResponse[]> {
    this.loaderService.turnOn();

    return this.profilesService.getProfiles().pipe(
      take(1),
      tap((profiles: ProfilesResponse[]) => {
        this.allProfiles.set(profiles);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public updateProfile(profileDto: FormData): Observable<ProfilesResponse> {
    this.loaderService.turnOn();
    return this.profilesService.updateProfile(profileDto).pipe(
      take(1),
      tap(() => {
        this.message.success(MESSAGE.UPDATE_PROFILE_SUCCESS);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }
}
