import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { of } from 'rxjs';

import { HeaderComponent } from '@/app/core/components/header/header.component';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';
import { MessageService } from '@/app/shared/services/message/message.service';

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
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: ThemeSwitchService, useValue: mockThemeSwitchService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: of({}) } } },
        { provide: MessageService, useValue: {} },
      ],
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
