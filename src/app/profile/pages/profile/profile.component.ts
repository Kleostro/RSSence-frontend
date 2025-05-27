import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileResponse, ProfileSchema } from '@/app/api/schemas/profiles-response';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ProfileInfoComponent } from '@/app/profile/components/profile-info/profile-info.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfileInfoComponent],
  selector: 'app-profile',
  styleUrl: './profile.component.scss',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  public readonly navigationService = inject(NavigationService);

  public currentProfile = signal<null | ProfileResponse>(null);

  public ngOnInit(): void {
    const { data } = this.route.snapshot;
    if ('profile' in data) {
      const result = ProfileSchema.safeParse(data['profile']);
      this.currentProfile.set(result.data ?? null);
    }
  }
}
