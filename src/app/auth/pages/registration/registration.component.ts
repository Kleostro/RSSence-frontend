import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RegistrationFormComponent } from '@/app/auth/components/registration-form/registration-form.component';

@Component({
  selector: 'app-registration',
  imports: [RegistrationFormComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RegistrationComponent {}
