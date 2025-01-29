import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';

import { HeaderComponent } from '@/app/core/components/header/header.component';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockThemeSwitchService: { toggle: jest.Mock };

  beforeEach(async () => {
    mockThemeSwitchService = {
      toggle: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, ButtonModule],
      providers: [{ provide: ThemeSwitchService, useValue: mockThemeSwitchService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggle method when the theme toggle button is clicked', async () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

    button.click();
    await fixture.whenStable();

    expect(mockThemeSwitchService.toggle).toHaveBeenCalled();
  });
});
