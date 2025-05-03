import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-profile-bio',
  styleUrl: './profile-bio.component.scss',
  templateUrl: './profile-bio.component.html',
})
export class ProfileBioComponent {
  public bio = input.required<string>();
}
