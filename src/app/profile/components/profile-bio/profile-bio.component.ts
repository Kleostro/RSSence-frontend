import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-bio',
  imports: [],
  templateUrl: './profile-bio.component.html',
  styleUrl: './profile-bio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileBioComponent {
  public bio = input.required<string>();
}
