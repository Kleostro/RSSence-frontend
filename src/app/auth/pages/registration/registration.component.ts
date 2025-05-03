import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RegistrationFormComponent } from '@/app/auth/components/registration-form/registration-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RegistrationFormComponent],
  selector: 'app-registration',
  styleUrl: './registration.component.scss',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {}
