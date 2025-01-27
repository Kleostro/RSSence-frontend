import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { AuthResponse } from '@/app/api/schemas/auth-response';
import { SignUpService } from '@/app/api/services/sign-up/sign-up.service';
import { ENVIRONMENT } from '@/environment/environment';

describe('SignUpService', () => {
  let service: SignUpService;
  let httpClientMock: { post: jest.Mock };

  beforeEach(() => {
    httpClientMock = { post: jest.fn() };

    TestBed.configureTestingModule({
      providers: [SignUpService, { provide: HttpClient, useValue: httpClientMock }],
    });
    service = TestBed.inject(SignUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should return the auth response on success', () => {
      const mockResponse: AuthResponse = { accessToken: 'new-token' };
      httpClientMock.post.mockReturnValue(of(mockResponse));

      const email = 'test@example.com';
      const password = 'password123';

      service.register(email, password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(httpClientMock.post).toHaveBeenCalledWith(`${ENVIRONMENT.API_URL}${ENDPOINTS.SIGN_UP}`, {
          email,
          password,
        });
      });
    });

    it('should handle error correctly', () => {
      const errorResponse = new Error('Something went wrong');
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      const email = 'test@example.com';
      const password = 'password123';

      service.register(email, password).subscribe({
        error: (error) => {
          expect(error).toEqual(errorResponse);
          expect(httpClientMock.post).toHaveBeenCalledWith(`${ENVIRONMENT.API_URL}${ENDPOINTS.SIGN_UP}`, {
            email,
            password,
          });
        },
      });
    });
  });
});
