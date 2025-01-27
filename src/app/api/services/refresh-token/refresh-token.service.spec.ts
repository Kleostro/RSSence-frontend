import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { AuthResponse } from '@/app/api/schemas/auth-response';
import { RefreshTokenService } from '@/app/api/services/refresh-token/refresh-token.service';
import { ENVIRONMENT } from '@/environment/environment';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let httpClientMock: { post: jest.Mock };

  beforeEach(() => {
    httpClientMock = { post: jest.fn() };

    TestBed.configureTestingModule({
      providers: [RefreshTokenService, { provide: HttpClient, useValue: httpClientMock }],
    });
    service = TestBed.inject(RefreshTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('refreshToken', () => {
    it('should return the auth response on success', () => {
      const mockResponse: AuthResponse = { accessToken: 'new-token' };
      httpClientMock.post.mockReturnValue(of(mockResponse));

      service.refreshToken().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(httpClientMock.post).toHaveBeenCalledWith(`${ENVIRONMENT.API_URL}${ENDPOINTS.REFRESH}`, null);
      });
    });

    it('should handle error correctly and return an empty observable', () => {
      const errorResponse = new Error('Something went wrong');
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      service.refreshToken().subscribe({
        error: (error) => {
          expect(error).toEqual(errorResponse);
          expect(httpClientMock.post).toHaveBeenCalledWith(`${ENVIRONMENT.API_URL}${ENDPOINTS.REFRESH}`, null);
        },
      });
    });
  });
});
