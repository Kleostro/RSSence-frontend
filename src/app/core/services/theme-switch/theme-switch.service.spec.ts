import { TestBed } from '@angular/core/testing';
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';

import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';
import { TUI_DARK_MODE, TUI_DARK_MODE_KEY } from '@taiga-ui/core';

describe('ThemeSwitchService', () => {
  let service: ThemeSwitchService;
  let mockStorage: { removeItem: jest.Mock };
  let mockDarkMode: jest.Mock & { set: jest.Mock };
  let mockMedia: { matches: boolean };

  beforeEach(() => {
    mockStorage = { removeItem: jest.fn() };
    mockDarkMode = jest.fn() as jest.Mock & { set: jest.Mock };
    mockDarkMode.set = jest.fn();

    mockMedia = { matches: true };

    TestBed.configureTestingModule({
      providers: [
        ThemeSwitchService,
        { provide: TUI_DARK_MODE_KEY, useValue: 'darkModeKey' },
        { provide: WA_LOCAL_STORAGE, useValue: mockStorage },
        { provide: WA_WINDOW, useValue: { matchMedia: (): { matches: boolean } => mockMedia } },
        { provide: TUI_DARK_MODE, useValue: mockDarkMode },
      ],
    });

    service = TestBed.inject(ThemeSwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set dark mode on initialization based on media query', () => {
    service.ngOnInit();
    expect(mockDarkMode.set).toHaveBeenCalledWith(mockMedia.matches);
  });

  it('should toggle dark mode and remove item from storage on toggle', () => {
    mockDarkMode.mockReturnValue(true);

    service.toggle();

    expect(mockStorage.removeItem).toHaveBeenCalledWith('darkModeKey');
    expect(mockDarkMode.set).toHaveBeenCalledWith(false);
  });
});
