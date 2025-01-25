import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { RefreshTokenService } from '@/app/api/services/refreshToken/refresh-token.service';
import { SignUpService } from '@/app/api/services/sign-up/sign-up.service';
import { TokenService } from '@/app/api/services/token/token.service';
import { AuthResponse } from '@/app/api/types/auth-response';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';

describe('AuthService', () => {
  let service: AuthService;
  let signUpServiceMock: { register: jest.Mock };
  let tokenServiceMock: { setToken: jest.Mock; getToken: jest.Mock; removeToken: jest.Mock };
  let navigationServiceMock: { navigateToLogin: jest.Mock };
  let refreshTokenServiceMock: { refreshToken: jest.Mock };

  beforeEach(() => {
    signUpServiceMock = { register: jest.fn() };
    tokenServiceMock = {
      setToken: jest.fn(),
      getToken: jest.fn(),
      removeToken: jest.fn(),
    };
    navigationServiceMock = { navigateToLogin: jest.fn() };
    refreshTokenServiceMock = { refreshToken: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SignUpService, useValue: signUpServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: NavigationService, useValue: navigationServiceMock },
        { provide: RefreshTokenService, useValue: refreshTokenServiceMock },
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should handle successful registration', () => {
      const mockResponse: AuthResponse = { accessToken: 'test-token' };
      signUpServiceMock.register.mockReturnValue(of(mockResponse));

      service.register({ email: 'test@test.com', password: 'password' }).subscribe(() => {
        expect(signUpServiceMock.register).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
        expect(tokenServiceMock.setToken).toHaveBeenCalledWith(mockResponse.accessToken);
      });
    });

    it('should handle registration error', () => {
      signUpServiceMock.register.mockReturnValue(of({}));
      service.register({ email: 'test@test.com', password: 'password' }).subscribe();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      const mockResponse: AuthResponse = { accessToken: 'new-token' };
      refreshTokenServiceMock.refreshToken.mockReturnValue(of(mockResponse));

      service.refreshToken().subscribe(() => {
        expect(refreshTokenServiceMock.refreshToken).toHaveBeenCalled();
        expect(tokenServiceMock.setToken).toHaveBeenCalledWith(mockResponse.accessToken);
      });
    });

    it('should handle token refresh error and navigate to login', () => {
      refreshTokenServiceMock.refreshToken.mockReturnValue(of(null));

      service.refreshToken().subscribe(() => {
        expect(tokenServiceMock.removeToken).toHaveBeenCalled();
        expect(navigationServiceMock.navigateToLogin).toHaveBeenCalled();
      });
    });
  });

  describe('checkAuth', () => {
    it('should return true and refresh token if token exists', () => {
      tokenServiceMock.getToken.mockReturnValue('mock-token');
      refreshTokenServiceMock.refreshToken.mockReturnValue(of({ accessToken: 'new-token' }));

      expect(service.checkAuth()).toBe(true);
      expect(refreshTokenServiceMock.refreshToken).toHaveBeenCalled();
    });

    it('should return false if no token exists', () => {
      tokenServiceMock.getToken.mockReturnValue(null);

      expect(service.checkAuth()).toBe(false);
    });
  });
});
