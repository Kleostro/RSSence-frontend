import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { SidebarComponent } from '@/app/core/components/sidebar/sidebar.component';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockThemeSwitchService: { toggle: jest.Mock };

  beforeEach(async () => {
    mockThemeSwitchService = {
      toggle: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: ThemeSwitchService, useValue: mockThemeSwitchService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
        { provide: MessageService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
