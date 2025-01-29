import { TestBed } from '@angular/core/testing';
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';

import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';

describe('ThemeSwitchService', () => {
  let service: ThemeSwitchService;
  let mockStorage: { getItem: jest.Mock; setItem: jest.Mock; removeItem: jest.Mock };
  let mockMedia: { matches: boolean };

  beforeEach(() => {
    mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    mockMedia = { matches: true };

    TestBed.configureTestingModule({
      providers: [
        ThemeSwitchService,
        { provide: WA_LOCAL_STORAGE, useValue: mockStorage },
        { provide: WA_WINDOW, useValue: { matchMedia: (): { matches: boolean } => mockMedia } },
      ],
    });

    service = TestBed.inject(ThemeSwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize dark mode based on localStorage value', () => {
    mockStorage.getItem.mockReturnValue('dark');
    mockMedia.matches = false;

    service = TestBed.inject(ThemeSwitchService);

    expect(mockStorage.getItem).toHaveBeenCalledWith('app-theme');
    expect(mockStorage.setItem).not.toHaveBeenCalled();
  });

  it('should initialize dark mode based on system preference if localStorage is empty', () => {
    mockStorage.getItem.mockReturnValue(null);
    mockMedia.matches = true;

    service = TestBed.inject(ThemeSwitchService);

    expect(mockStorage.getItem).toHaveBeenCalledWith('app-theme');
    expect(mockStorage.setItem).not.toHaveBeenCalled();
  });

  it('should remove dark mode from the DOM when toggling from dark to light', () => {
    const mockHtmlElement = {
      classList: { add: jest.fn(), remove: jest.fn() },
    };
    jest.spyOn(document, 'querySelector').mockReturnValue(mockHtmlElement as unknown as HTMLElement);

    mockStorage.getItem.mockReturnValue('dark');
    service = TestBed.inject(ThemeSwitchService);

    service.toggle();

    expect(mockHtmlElement.classList.remove).toHaveBeenCalledWith('app-dark');
    expect(mockStorage.setItem).toHaveBeenCalledWith('app-theme', 'light');
  });
});
