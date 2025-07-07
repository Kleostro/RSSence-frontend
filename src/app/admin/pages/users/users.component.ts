import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';

import { PaginatorState } from 'primeng/paginator';
import { catchError, EMPTY, finalize, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { UsersListComponent } from '@/app/admin/components/users-list/users-list.component';
import { PaginationQueryDto } from '@/app/api/interfaces/pagination-query';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { PaginatedUserResponse } from '@/app/api/schemas/users-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { ProfilesService } from '@/app/api/services/profiles/profiles.service';
import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { MESSAGE } from '@/app/shared/services/constants/message';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UsersListComponent],
  selector: 'app-users',
  styleUrl: './users.component.scss',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnDestroy, OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly message = inject(MessageService);
  private readonly modalService = inject(ModalService);
  private readonly profilesService = inject(ProfilesService);
  private readonly rolesService = inject(RolesService);
  private readonly usersService = inject(UsersService);
  private destroy$ = new Subject<void>();
  public paginatedUserResponse = signal<null | PaginatedUserResponse>(null);
  public usersListComponent = viewChild.required(UsersListComponent);

  private handleDelete<T>(action: () => Observable<T>, successMessage = '', errorMessage = ''): void {
    action()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.loadUsers()),
        tap(() => {
          if (successMessage) {
            this.message.success(successMessage);
          }
        }),
        finalize(() => {
          this.modalService.closeModal();
          this.usersListComponent().isProcessing.set(false);
        }),
        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message || errorMessage);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public handleDeleteAuthorEvent(username: string): void {
    this.handleDelete(() => this.authorsService.deleteAuthor(username));
  }

  public handleDeleteProfileEvent(username: string): void {
    this.handleDelete(() => this.profilesService.deleteProfile(username));
  }

  public handleDeleteUserEvent(userId: number): void {
    this.handleDelete(() => this.usersService.deleteUser(userId));
  }

  public handlePageChangeEvent(event: PaginatorState): void {
    const { page = 1, rows } = event;
    this.loadUsers({ limit: rows, page: page + 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public handleToggleRoleEvent({ isAdd, role, userId }: { isAdd: boolean; role: string; userId: number }): void {
    const action$ = isAdd
      ? this.rolesService.removeRoleFromUser(userId, role)
      : this.rolesService.addRoleToUser(userId, role);

    action$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.loadUsers()),
        tap(() => {
          this.message.info(isAdd ? MESSAGE.REMOVE_ROLE_SUCCESS : MESSAGE.ADD_ROLE_SUCCESS);
        }),
        finalize(() => {
          this.usersListComponent().isProcessing.set(false);
        }),
        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public loadUsers(query?: PaginationQueryDto): Observable<null | PaginatedUserResponse> {
    return this.usersService.getAllUsers(query).pipe(
      tap((response: null | PaginatedUserResponse) => {
        this.paginatedUserResponse.set(response);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.loadUsers().pipe(takeUntil(this.destroy$)).subscribe();
  }
}
