import { inject, Injectable, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { UserResponse } from '@/app/api/schemas/users-response';
import { UsersService } from '@/app/api/services/users/users.service';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly message = inject(MessageService);
  private readonly usersService = inject(UsersService);

  public me = signal<null | UserResponse>(null);

  public getMe(): Observable<null | UserResponse> {
    return this.usersService.getMe().pipe(
      tap((me: null | UserResponse) => {
        this.me.set(me);
      }),
    );
  }

  public getUserById(userId: number): Observable<null | UserResponse> {
    return this.usersService.getUserById(userId);
  }
}
