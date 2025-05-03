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
import { finalize } from 'rxjs';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { passwordsMatchValidator } from '@/app/auth/validators/validators';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { trimData } from '@/app/utils/trim-data';

const MIN_LENGTH = 8;
const MAX_LENGTH = 32;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  selector: 'app-registration-form',
  styleUrl: './registration-form.component.scss',
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  public APP_ROUTE = APP_ROUTE;
  public isRegistrationInProgress = signal(false);
  public registrationForm = this.fb.nonNullable.group(
    {
      confirm: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
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

    this.authService
      .register({ email, password })
      .pipe(
        finalize(() => {
          this.isRegistrationInProgress.set(false);
        }),
      )
      .subscribe();
  }
}
