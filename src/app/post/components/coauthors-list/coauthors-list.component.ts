import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { AuthorService } from '@/app/author/services/author/author.service';

@Component({
  selector: 'app-coauthors-list',
  imports: [Avatar, AvatarGroup, TooltipModule, BadgeModule, RouterLink, NgIf],
  templateUrl: './coauthors-list.component.html',
  styleUrl: './coauthors-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoauthorsListComponent {
  public coauthorsIds = input<number[]>([]);
  public readonly authorService = inject(AuthorService);

  public isShortCoauthors = signal<boolean>(true);
}
