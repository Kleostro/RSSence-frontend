import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageService } from 'primeng/api';

import { ProfileMeComponent } from '@/app/profile/pages/profile-me/profile-me.component';

describe('ProfileMeComponent', () => {
  let component: ProfileMeComponent;
  let fixture: ComponentFixture<ProfileMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileMeComponent],
      providers: [provideHttpClient(), { provide: MessageService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
