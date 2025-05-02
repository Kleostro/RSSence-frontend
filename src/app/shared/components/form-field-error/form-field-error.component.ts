import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { FIELD_ERROR_KEY } from '@/app/shared/constants/field-error-key';

@Component({
  selector: 'app-form-field-error',
  imports: [],
  templateUrl: './form-field-error.component.html',
  styleUrl: './form-field-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldErrorComponent implements OnInit, OnDestroy {
  public readonly control = input.required<AbstractControl>();
  public readonly fieldBoundaries = input.required<Record<string, unknown>>();
  public readonly errorMessages = input.required<Record<string, string | undefined | null>>();
  public readonly field = input.required<string>();
  public readonly errorMessage = signal<string | null>(null);

  private readonly destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.control()
      .statusChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.errorMessage.set(this.getError());
      });
  }

  private getDefaultErrorMessage(errorKey: string, fieldBoundaries?: Record<string, unknown>): string {
    const messages: Record<string, string> = {
      [FIELD_ERROR_KEY.REQUIRED]: 'This field is required.',
      [FIELD_ERROR_KEY.MIN_LENGTH]: `Minimum length is ${String(fieldBoundaries?.['MIN_LENGTH'])} characters.`,
      [FIELD_ERROR_KEY.MAX_LENGTH]: `Maximum length is ${String(fieldBoundaries?.['MAX_LENGTH'])} characters.`,
      [FIELD_ERROR_KEY.USERNAME_EXISTS]: 'This username is already taken.',
    };
    return messages[errorKey] || 'Something went wrong.';
  }

  private getError(): string | null {
    const control = this.control();
    if (control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      const defaultMessage = this.getDefaultErrorMessage(errorKey, this.fieldBoundaries());
      const customMessage = this.errorMessages()[errorKey];

      const message = customMessage ?? defaultMessage;
      const boundaries = this.fieldBoundaries();
      return this.interpolateMessage(message, { ...boundaries });
    }
    return null;
  }

  private interpolateMessage(message: string, params: Record<string, unknown>): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/no-unsafe-member-access
    return message.replace(/{{\s*(\w+)\s*}}/g, (_, key) => String(params[key] ?? ''));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
