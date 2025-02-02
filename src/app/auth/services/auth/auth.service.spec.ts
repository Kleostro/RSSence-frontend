import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { LoginService } from '@/app/api/services/login/login.service';
import { LogoutService } from '@/app/api/services/logout/logout.service';
import { RefreshTokenService } from '@/app/api/services/refresh-token/refresh-token.service';
import { SignUpService } from '@/app/api/services/sign-up/sign-up.service';
import { TokenService } from '@/app/api/services/token/token.service';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { MessageService } from '@/app/shared/services/message.service';

describe('AuthService', () => {
  let authService: AuthService;
  let loginService: jest.Mocked<LoginService>;
  let logoutService: jest.Mocked<LogoutService>;
  let signUpService: jest.Mocked<SignUpService>;
  let refreshTokenService: jest.Mocked<RefreshTokenService>;
  let tokenService: jest.Mocked<TokenService>;
  let navigationService: jest.Mocked<NavigationService>;
  let messageService: jest.Mocked<MessageService>;

  beforeEach(() => {
    const loginServiceMock = {
      login: jest.fn(),
    };
    const signUpServiceMock = {
      register: jest.fn(),
    };
    const logoutServiceMock = {
      logout: jest.fn().mockReturnValue(of({})),
    };
    const refreshTokenServiceMock = {
      refreshToken: jest.fn(),
    };
    const tokenServiceMock = {
      getToken: jest.fn(),
      setToken: jest.fn(),
      removeToken: jest.fn(),
    };
    const navigationServiceMock = {
      navigateToHome: jest.fn(),
      navigateToLogin: jest.fn(),
    };
    const messageServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClientTesting(),
        AuthService,
        { provide: LoginService, useValue: loginServiceMock },
        { provide: SignUpService, useValue: signUpServiceMock },
        { provide: LogoutService, useValue: logoutServiceMock },
        { provide: RefreshTokenService, useValue: refreshTokenServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: NavigationService, useValue: navigationServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });

    authService = TestBed.inject(AuthService);
    loginService = TestBed.inject(LoginService) as jest.Mocked<LoginService>;
    logoutService = TestBed.inject(LogoutService) as jest.Mocked<LogoutService>;
    signUpService = TestBed.inject(SignUpService) as jest.Mocked<SignUpService>;
    refreshTokenService = TestBed.inject(RefreshTokenService) as jest.Mocked<RefreshTokenService>;
    tokenService = TestBed.inject(TokenService) as jest.Mocked<TokenService>;
    navigationService = TestBed.inject(NavigationService) as jest.Mocked<NavigationService>;
    messageService = TestBed.inject(MessageService) as jest.Mocked<MessageService>;
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should handle successful registration', () => {
    const mockResponse = { accessToken: 'mockToken', refreshToken: 'mockRefreshToken' };
    signUpService.register.mockReturnValue(of(mockResponse));

    authService.register({ email: 'test@example.com', password: 'password' }).subscribe(() => {
      expect(messageService.success).toHaveBeenCalledWith('Registration successful');
    });
  });

  it('should handle registration error', () => {
    const mockError = { message: 'Registration failed' };
    signUpService.register.mockReturnValue(throwError(() => mockError));

    authService.register({ email: 'test@example.com', password: 'password' }).subscribe({
      error: () => {
        expect(messageService.error).toHaveBeenCalledWith('Registration failed');
      },
    });
  });

  it('should handle successful login', () => {
    const mockResponse = { accessToken: 'mockToken', refreshToken: 'mockRefreshToken' };
    loginService.login.mockReturnValue(of(mockResponse));

    authService.login({ email: 'test@example.com', password: 'password' }).subscribe(() => {
      expect(tokenService.setToken).toHaveBeenCalledWith('mockToken');
      expect(navigationService.navigateToHome).toHaveBeenCalled();
      expect(messageService.success).toHaveBeenCalledWith('Login successful');
    });
  });

  it('should handle login error', () => {
    const mockError = { message: 'Login failed' };
    loginService.login.mockReturnValue(throwError(() => mockError));

    authService.login({ email: 'test@example.com', password: 'password' }).subscribe({
      error: () => {
        expect(messageService.error).toHaveBeenCalledWith('Login failed');
      },
    });
  });

  it('should refresh token successfully', () => {
    const mockResponse = { accessToken: 'newMockToken', refreshToken: 'newRefreshToken' };
    refreshTokenService.refreshToken.mockReturnValue(of(mockResponse));

    authService.refreshToken().subscribe(() => {
      expect(tokenService.setToken).toHaveBeenCalledWith('newMockToken');
      expect(messageService.success).toHaveBeenCalledWith('Login successful');
    });
  });

  it('should handle token refresh error and navigate to login', () => {
    refreshTokenService.refreshToken.mockReturnValue(throwError(() => new Error('Token refresh failed')));

    authService.refreshToken().subscribe({
      error: () => {
        expect(tokenService.removeToken).toHaveBeenCalled();
        expect(navigationService.navigateToLogin).toHaveBeenCalled();
      },
    });
  });

  it('should return true and refresh token if token exists', () => {
    tokenService.getToken.mockReturnValue({ accessToken: 'mockToken', refreshToken: 'mockRefreshToken' });
    refreshTokenService.refreshToken.mockReturnValue(
      of({ accessToken: 'newMockToken', refreshToken: 'newRefreshToken' }),
    );

    const result = authService.checkAuth();
    expect(result).toBe(true);
    expect(refreshTokenService.refreshToken).toHaveBeenCalled();
  });

  it('should return false if no token exists', () => {
    tokenService.getToken.mockReturnValue(null);

    const result = authService.checkAuth();
    expect(result).toBe(false);
  });

  it('should handle logout successfully', () => {
    authService.logout().subscribe(() => {
      expect(logoutService.logout).toHaveBeenCalled();
      expect(tokenService.removeToken).toHaveBeenCalled();
      expect(navigationService.navigateToLogin).toHaveBeenCalled();
      expect(messageService.success).toHaveBeenCalledWith('Logout successful');
    });
  });
});
