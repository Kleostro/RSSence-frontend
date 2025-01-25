import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { RefreshTokenService } from '@/app/api/services/refreshToken/refresh-token.service';
import { AuthResponse } from '@/app/api/types/auth-response';
import { ENVIRONMENT } from '@/environment/environment';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let httpClientMock: { get: jest.Mock };

  beforeEach(() => {
    httpClientMock = { get: jest.fn() };

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
      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.refreshToken().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(httpClientMock.get).toHaveBeenCalledWith(`${ENVIRONMENT.API_URL}${ENDPOINTS.REFRESH}`);
      });
    });

    it('should handle error correctly and return an empty observable', () => {
      const errorResponse = new Error('Something went wrong');
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      service.refreshToken().subscribe({
        error: (error) => {
          expect(error).toEqual(errorResponse);
          expect(httpClientMock.get).toHaveBeenCalledWith(`${ENVIRONMENT.API_URL}${ENDPOINTS.REFRESH}`);
        },
      });
    });
  });
});
