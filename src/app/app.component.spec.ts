import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuiRoot } from '@taiga-ui/core';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

import { AppComponent } from './app.component';
import { ThemeSwitchService } from './core/services/theme-switch/theme-switch.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let mockThemeSwitchService: { toggle: jest.Mock; darkMode: jest.Mock };

  beforeEach(async () => {
    mockThemeSwitchService = {
      toggle: jest.fn(),
      darkMode: jest.fn(() => false),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, TuiRoot],
      providers: [{ provide: ThemeSwitchService, useValue: mockThemeSwitchService }, NG_EVENT_PLUGINS],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it("should have the 'RSSence-frontend' title", () => {
    expect(app.title).toEqual('RSSence-frontend');
  });

  it('should initialize themeSwitchService on component creation', () => {
    expect(app.themeSwitchService).toBeDefined();
    expect(mockThemeSwitchService.toggle).not.toHaveBeenCalled();
    expect(mockThemeSwitchService.darkMode).toHaveBeenCalled();
  });
});
