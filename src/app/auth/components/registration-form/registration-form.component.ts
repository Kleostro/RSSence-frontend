import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { firstValueFrom } from 'rxjs';

import { SignUpService } from '@/app/api/services/sign-up/sign-up.service';
import { TuiRipple } from '@taiga-ui/addon-mobile';
import { TuiAppearance, TuiButton, TuiError, TuiNotification, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';

import { passwordsMatchValidator } from '../../validators/validators';

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
  private readonly signUpService = inject(SignUpService);
  private readonly fb = inject(FormBuilder);

  public form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: passwordsMatchValidator,
    },
  );

  public async onSubmit(): Promise<void> {
    if (this.form.valid) {
      try {
        await firstValueFrom(
          this.signUpService.register(
            String(this.form.controls.email.value),
            String(this.form.controls.password.value),
          ),
        );
        // TBD: replace with notifications
        // eslint-disable-next-line no-console
        console.log('Registration successful');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Registration failed', err);
      }
    }
  }
}
