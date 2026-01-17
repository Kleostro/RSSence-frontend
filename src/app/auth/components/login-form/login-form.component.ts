import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { finalize } from 'rxjs';

import { handleHttpError } from '@/app/api/utils/handle-http-error';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { LOGIN_FORM_FIELD_CONFIG } from '@/app/constants/form/login-form';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';
import { LoginForm } from '@/app/interfaces/login-form';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { MessageService } from '@/app/shared/services/message/message.service';
import { trimData } from '@/app/utils/trim-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, RippleModule, PasswordModule, FormFieldErrorComponent],
  selector: 'app-login-form',
  styleUrl: './login-form.component.scss',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(MessageService);

  public readonly navigationService = inject(NavigationService);
  public APP_ROUTE = APP_ROUTE;
  public form!: FormGroup<LoginForm>;
  public isProcessing = signal(false);

  public LOGIN_FORM_FIELD_CONFIG = LOGIN_FORM_FIELD_CONFIG;
  public loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  private createFormData(): { email: string; password: string } {
    const { email, password } = trimData(this.form.getRawValue());

    return { email, password };
  }

  private disableForm(): void {
    this.isProcessing.set(true);
    this.form.disable();
  }

  private enableForm(): void {
    this.isProcessing.set(false);
    this.form.enable();
  }

  private handleFormSubmit(formData: { email: string; password: string }): void {
    this.authService
      .login(formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        handleHttpError(this.message),
        finalize(() => {
          this.enableForm();
        }),
      )
      .subscribe();
  }

  private initForm(): void {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required.bind(this), Validators.email.bind(this)]],
      password: [
        '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.LOGIN_FORM_FIELD_CONFIG.password.min),
          Validators.maxLength(this.LOGIN_FORM_FIELD_CONFIG.password.max),
        ],
      ],
    });
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.disableForm();
    const formData = this.createFormData();
    this.handleFormSubmit(formData);
  }
}
