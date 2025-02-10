import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, Observable, take, tap } from 'rxjs';

import { ProfilesResponse } from '@/app/api/schemas/profiles-response';
import { ProfilesService } from '@/app/api/services/profiles/profiles.service';
import { MessageService } from '@/app/shared/services/message.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly profilesService = inject(ProfilesService);
  private readonly message = inject(MessageService);

  public readonly currentProfile = signal<ProfilesResponse | null>(null);

  public createProfile(profileDto: FormData): Observable<ProfilesResponse> {
    return this.profilesService.createProfile(profileDto).pipe(
      take(1),
      tap((profile: ProfilesResponse) => {
        this.currentProfile.set(profile);
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
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public deleteProfileMe(): Observable<ProfilesResponse> {
    return this.profilesService.deleteProfileMe().pipe(
      take(1),
      tap(() => {
        this.currentProfile.set(null);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.message.error(error.message);
    return EMPTY;
  }
}
