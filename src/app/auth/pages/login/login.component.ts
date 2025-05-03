import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoginFormComponent } from '@/app/auth/components/login-form/login-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent],
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent {}
