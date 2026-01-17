import { animate, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { AuthorResponse } from '@/app/api/schemas/authors-response';

@Component({
  animations: [
    trigger('coauthorCollapse', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleX(0)', transformOrigin: 'left' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scaleX(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scaleX(1)', transformOrigin: 'left' }),
        animate('300ms ease-out', style({ opacity: 0, transform: 'scaleX(0)' })),
      ]),
    ]),
  ],
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
