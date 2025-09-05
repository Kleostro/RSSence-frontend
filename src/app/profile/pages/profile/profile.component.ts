import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { tap } from 'rxjs';

import { UserResponse, UserSchema } from '@/app/api/schemas/users-response';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  public readonly navigationService = inject(NavigationService);
  public currentUser = signal<null | UserResponse>(null);

  public ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ user }) => {
          const result = UserSchema.safeParse(user);
          if (result.success) {
            this.currentUser.set(result.data);
          }
        }),
      )
      .subscribe();
  }
}
