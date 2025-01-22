import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-registration-form',
  imports: [],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RegistrationFormComponent {}
