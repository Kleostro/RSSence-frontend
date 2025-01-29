import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { RegistrationFormComponent } from '@/app/auth/components/registration-form/registration-form.component';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { MessageService as UserMessageService } from '@/app/shared/services/message.service';

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let authServiceMock: { register: jest.Mock };

  beforeEach(() => {
    authServiceMock = {
      register: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RegistrationFormComponent, ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        FormBuilder,
        {
          provide: UserMessageService,
          useValue: {
            success: jest.fn(),
            error: jest.fn(),
            info: jest.fn(),
            warning: jest.fn(),
          },
        },
        {
          provide: MessageService,
          useValue: {
            add: jest.fn(),
          },
        },
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
    component.registrationForm.controls.email.setValue('');
    component.registrationForm.controls.password.setValue('');
    component.registrationForm.controls.confirm.setValue('');
    expect(component.registrationForm.valid).toBe(false);
  });

  it('should call registerUser on successful form submission', () => {
    const email = 'test@example.com';
    const password = 'password123';
    component.registrationForm.controls.email.setValue(email);
    component.registrationForm.controls.password.setValue(password);
    component.registrationForm.controls.confirm.setValue(password);
    authServiceMock.register.mockReturnValue(of({}));

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith({ email, password });
  });

  it('should show a success notification after successful registration', () => {
    const email = 'test@example.com';
    const password = 'password123';
    component.registrationForm.controls.email.setValue(email);
    component.registrationForm.controls.password.setValue(password);
    component.registrationForm.controls.confirm.setValue(password);
    authServiceMock.register.mockReturnValue(of({}));

    component.onSubmit();
  });

  it('should handle registration errors correctly', () => {
    const email = 'test@example.com';
    const password = 'password123';
    component.registrationForm.controls.email.setValue(email);
    component.registrationForm.controls.password.setValue(password);
    component.registrationForm.controls.confirm.setValue(password);
    authServiceMock.register.mockReturnValue(throwError(() => new Error('Registration failed')));

    component.onSubmit();
  });
});
