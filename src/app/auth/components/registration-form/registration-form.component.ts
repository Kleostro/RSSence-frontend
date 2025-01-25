import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { firstValueFrom } from 'rxjs';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { passwordsMatchValidator } from '@/app/auth/validators/validators';
import { trimData } from '@/app/utils/trim-data';
import { TuiRipple } from '@taiga-ui/addon-mobile';
import { TuiAppearance, TuiButton, TuiError, TuiNotification, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-registration-form',
  imports: [
    TuiAppearance,
    AsyncPipe,
    ReactiveFormsModule,
    TuiButton,
    TuiCardLarge,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiHeader,
    TuiNotification,
    TuiTextfield,
    TuiTitle,
    TuiRipple,
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  public isRegistrationInProgress = signal(false);

  public form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      confirm: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
    },
    {
      validators: passwordsMatchValidator,
    },
  );

  public async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.isRegistrationInProgress.set(true);

    try {
      const { email, password } = trimData(this.form.getRawValue());
      await this.registerUser(email, password);
      this.showSuccessNotification();
    } catch (error) {
      this.handleRegistrationError(error);
    } finally {
      this.isRegistrationInProgress.set(false);
    }
  }

  private async registerUser(email: string, password: string): Promise<void> {
    await firstValueFrom(this.authService.register({ email, password }));
  }

  private showSuccessNotification(): void {
    // eslint-disable-next-line no-console
    console.log('Registration successful');
  }

  private handleRegistrationError(error: unknown): void {
    // eslint-disable-next-line no-console
    console.error('Registration failed', error);
  }
}
