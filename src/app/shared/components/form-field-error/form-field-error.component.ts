import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { FIELD_ERROR_KEY } from '@/app/shared/constants/field-error-key';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-form-field-error',
  styleUrl: './form-field-error.component.scss',
  templateUrl: './form-field-error.component.html',
})
export class FormFieldErrorComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();

  public readonly control = input.required<AbstractControl>();
  public readonly errorMessage = signal<null | string>(null);
  public readonly errorMessages = input.required<Record<string, null | string | undefined>>();
  public readonly field = input.required<string>();
  public readonly fieldBoundaries = input.required<Record<string, unknown>>();

  private getDefaultErrorMessage(errorKey: string, fieldBoundaries?: Record<string, unknown>): string {
    const messages: Record<string, string> = {
      [FIELD_ERROR_KEY.MAX_LENGTH]: `Maximum length is ${String(fieldBoundaries?.['MAX_LENGTH'])} characters.`,
      [FIELD_ERROR_KEY.MIN_LENGTH]: `Minimum length is ${String(fieldBoundaries?.['MIN_LENGTH'])} characters.`,
      [FIELD_ERROR_KEY.REQUIRED]: 'This field is required.',
      [FIELD_ERROR_KEY.USERNAME_EXISTS]: 'This username is already taken.',
    };
    return messages[errorKey] || 'Something went wrong.';
  }

  private getError(): null | string {
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
    return message.replace(/{{\s*(\w+)\s*}}/g, (_, key: string) => {
      const value = params[key];

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      return '';
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.control()
      .statusChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.errorMessage.set(this.getError());
      });
  }
}
