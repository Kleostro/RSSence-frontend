import { TestBed } from '@angular/core/testing';

import { MessageService as PrimeNGMessageService } from 'primeng/api';

import { MessageService } from '@/app/shared/services/message/message.service';

describe('MessageService', () => {
  let service: MessageService;
  let mockPrimeNGMessageService: jest.Mocked<PrimeNGMessageService>;

  beforeEach(() => {
    mockPrimeNGMessageService = {
      add: jest.fn(),
    } as unknown as jest.Mocked<PrimeNGMessageService>;

    TestBed.configureTestingModule({
      providers: [MessageService, { provide: PrimeNGMessageService, useValue: mockPrimeNGMessageService }],
    });

    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call add with the correct parameters for success', () => {
    const message = 'Test success message';
    service.success(message);

    expect(mockPrimeNGMessageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      life: 3000,
      detail: message,
    });
  });

  it('should call add with the correct parameters for error', () => {
    const message = 'Test error message';
    service.error(message);

    expect(mockPrimeNGMessageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      life: 3000,
      detail: message,
    });
  });

  it('should call add with the correct parameters for info', () => {
    const message = 'Test info message';
    service.info(message);

    expect(mockPrimeNGMessageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Info',
      life: 3000,
      detail: message,
    });
  });

  it('should call add with the correct parameters for warning', () => {
    const message = 'Test warning message';
    service.warning(message);

    expect(mockPrimeNGMessageService.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      life: 3000,
      detail: message,
    });
  });
});
