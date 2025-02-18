import { TestBed } from '@angular/core/testing';

import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';
import { MessageService, MessageService as UserMessageService } from '@/app/shared/services/message/message.service';

describe('FileHandlingService', () => {
  let service: FileHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
    service = TestBed.inject(FileHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
