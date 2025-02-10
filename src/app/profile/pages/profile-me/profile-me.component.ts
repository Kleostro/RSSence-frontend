import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { ProfileService } from '@/app/profile/services/profile/profile.service';

@Component({
  selector: 'app-profile-me',
  imports: [JsonPipe],
  templateUrl: './profile-me.component.html',
  styleUrl: './profile-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMeComponent implements OnInit {
  public readonly profileService = inject(ProfileService);

  public ngOnInit(): void {
    this.profileService.getMe().subscribe();
  }
}
