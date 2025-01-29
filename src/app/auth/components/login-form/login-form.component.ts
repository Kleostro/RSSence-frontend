import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { trimData } from '@/app/utils/trim-data';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    IconField,
    InputIcon,
    DividerModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  public isLoginInProgress = signal(false);

  public APP_ROUTE = APP_ROUTE;

  public loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  public onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (!this.loginForm.valid) {
      return;
    }

    this.isLoginInProgress.set(true);

    const { email, password } = trimData(this.loginForm.getRawValue());

    this.authService.login({ email, password }).subscribe({
      complete: () => {
        this.isLoginInProgress.set(false);
      },
    });
  }
}
