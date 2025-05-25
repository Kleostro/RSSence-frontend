import { inject, Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { ProfileResponse } from '@/app/api/schemas/profiles-response';
import { ProfilesService } from '@/app/api/services/profiles/profiles.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly message = inject(MessageService);
  private readonly profilesService = inject(ProfilesService);

  public checkUsernameAvailability(username: string): Observable<boolean | null> {
    return this.profilesService.checkUsernameAvailability(username);
  }

  public createProfile(profileDto: FormData): Observable<ProfileResponse> {
    return this.profilesService.createProfile(profileDto).pipe(
      tap(() => {
        this.message.success(MESSAGE.CREATE_PROFILE_SUCCESS);
      }),
    );
  }

  public deleteProfile(): Observable<ProfileResponse> {
    return this.profilesService.deleteProfile().pipe(
      tap(() => {
        this.message.success(MESSAGE.DELETE_PROFILE_SUCCESS);
      }),
    );
  }

  public getProfileByUsername(username: string): Observable<null | ProfileResponse> {
    return this.profilesService.getProfileByUsername(username);
  }

  public getProfiles(): Observable<ProfileResponse[]> {
    return this.profilesService.getProfiles();
  }

  public updateProfile(profileDto: FormData): Observable<ProfileResponse> {
    return this.profilesService.updateProfile(profileDto).pipe(
      tap(() => {
        this.message.success(MESSAGE.UPDATE_PROFILE_SUCCESS);
      }),
    );
  }
}
