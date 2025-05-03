import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoginFormComponent } from '@/app/auth/components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
