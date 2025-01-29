import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { LoginFormComponent } from '@/app/auth/components/login-form/login-form.component';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { MessageService as UserMessageService } from '@/app/shared/services/message.service';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceMock: { login: jest.Mock };

  beforeEach(() => {
    authServiceMock = {
      login: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule, RouterModule.forRoot([])],
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

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form if email or password is not entered', () => {
    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('');
    expect(component.loginForm.valid).toBe(false);
  });

  it('should call loginUser on successful form submission', () => {
    const email = 'test@example.com';
    const password = 'password123';
    component.loginForm.controls.email.setValue(email);
    component.loginForm.controls.password.setValue(password);
    authServiceMock.login.mockReturnValue(of({}));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({ email, password });
  });

  it('should handle login errors correctly', () => {
    const email = 'test@example.com';
    const password = 'password123';
    component.loginForm.controls.email.setValue(email);
    component.loginForm.controls.password.setValue(password);
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Login failed')));

    component.onSubmit();
  });
});
