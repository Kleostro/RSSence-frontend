import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  linkedSignal,
  OnInit,
  Output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { PaginatedUserResponse, UserResponse } from '@/app/api/schemas/users-response';
import { RolesService } from '@/app/api/services/roles/roles.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Paginator, TableModule, Skeleton, ButtonModule, RippleModule, RouterLink, TagModule, Message, DatePipe],
  selector: 'app-users-list',
  styleUrl: './users-list.component.scss',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  @Output() public deleteAuthorEvent = new EventEmitter<string>();
  @Output() public deleteProfileEvent = new EventEmitter<string>();
  @Output() public deleteUserEvent = new EventEmitter<number>();
  @Output() public pageChangeEvent = new EventEmitter<PaginatorState>();
  public readonly modalService = inject(ModalService);
  public readonly rolesService = inject(RolesService);
  public readonly usersService = inject(UsersService);
  public candidateUser = signal<null | UserResponse>(null);
  public deleteAuthorConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('deleteAuthorConfirm');
  public deleteProfileConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('deleteProfileConfirm');
  public deleteUserConfirm = viewChild.required<TemplateRef<HTMLDivElement>>('deleteUserConfirm');
  public first = 0;
  public isProcessing = signal<boolean>(false);
  public paginatedUserResponse = input<null | PaginatedUserResponse>(null);
  public isUsersLoaded = linkedSignal({
    computation: () => this.paginatedUserResponse() !== null,
    source: this.paginatedUserResponse,
  });

  public metaKey = true;
  public selectedUser = signal<null | UserResponse>(null);

  public ngOnInit(): void {
    this.isUsersLoaded.set(true);
    this.selectedUser.set(this.usersService.me());
  }

  public onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.isUsersLoaded.set(false);
    this.pageChangeEvent.emit(event);
  }
}
