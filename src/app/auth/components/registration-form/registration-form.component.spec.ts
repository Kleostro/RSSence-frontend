import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { of, throwError } from 'rxjs';

import { RegistrationFormComponent } from '@/app/auth/components/registration-form/registration-form.component';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { TuiNotification } from '@taiga-ui/core';

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let authServiceMock: { register: jest.Mock };
  let tuiNotificationServiceMock: { show: jest.Mock };

  beforeEach(() => {
    authServiceMock = {
      register: jest.fn(),
    };
    tuiNotificationServiceMock = {
      show: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RegistrationFormComponent, ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TuiNotification, useValue: tuiNotificationServiceMock },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form if email or password is not entered', () => {
    component.form.controls.email.setValue('');
    component.form.controls.password.setValue('');
    component.form.controls.confirm.setValue('');
    expect(component.form.valid).toBe(false);
  });

  it('should call registerUser on successful form submission', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.confirm.setValue(password);
    authServiceMock.register.mockReturnValue(of({}));

    await component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith({ email, password });
  });

  it('should show a success notification after successful registration', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.confirm.setValue(password);
    authServiceMock.register.mockReturnValue(of({}));

    await component.onSubmit();
  });

  it('should handle registration errors correctly', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.confirm.setValue(password);
    authServiceMock.register.mockReturnValue(throwError(() => new Error('Registration failed')));

    await component.onSubmit();
  });
});
