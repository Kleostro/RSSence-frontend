import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { AuthorResponse } from '@/app/api/schemas/authors-response';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, AvatarGroup, TooltipModule, BadgeModule, RouterLink, NgIf],
  selector: 'app-coauthors-list',
  styleUrl: './coauthors-list.component.scss',
  templateUrl: './coauthors-list.component.html',
})
export class CoauthorsListComponent {
  public coauthors = input<AuthorResponse[]>([]);
  public isShortCoauthors = signal<boolean>(true);
}
