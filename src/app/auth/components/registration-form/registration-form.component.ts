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
import { passwordsMatchValidator } from '@/app/auth/validators/validators';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { trimData } from '@/app/utils/trim-data';

@Component({
  selector: 'app-registration-form',
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
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  public isRegistrationInProgress = signal(false);

  public APP_ROUTE = APP_ROUTE;

  public registrationForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      confirm: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
    },
    {
      validators: passwordsMatchValidator,
    },
  );

  public onSubmit(): void {
    this.registrationForm.markAllAsTouched();

    if (!this.registrationForm.valid) {
      return;
    }

    this.isRegistrationInProgress.set(true);

    const { email, password } = trimData(this.registrationForm.getRawValue());

    this.authService.register({ email, password }).subscribe({
      complete: () => {
        this.isRegistrationInProgress.set(false);
      },
    });
  }
}
