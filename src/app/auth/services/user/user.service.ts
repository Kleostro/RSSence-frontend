import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, finalize, Observable, of, take, tap } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { UsersResponse } from '@/app/api/schemas/users-response';
import { UsersService } from '@/app/api/services/users/users.service';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly message = inject(MessageService);
  private readonly loaderService = inject(LoaderService);
  private readonly usersService = inject(UsersService);

  public me = signal<UsersResponse | null>(null);

  public getMe(): Observable<UsersResponse | null> {
    this.loaderService.turnOn();
    return this.usersService.getMe().pipe(
      take(1),
      tap((me: UsersResponse | null) => {
        this.me.set(me);
      }),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  public getUserById(userId: number): Observable<UsersResponse | null> {
    this.loaderService.turnOn();
    return this.usersService.getUserById(userId).pipe(
      take(1),
      finalize(() => {
        this.loaderService.turnOff();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  private handleError(error: OverriddenHttpErrorResponse): Observable<null> {
    this.message.error(error.error.message);
    return of(null);
  }
}
