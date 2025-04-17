import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePreviewComponent } from '@/app/profile/components/profile-preview/profile-preview.component';

describe('ProfilePreviewComponent', () => {
  let component: ProfilePreviewComponent;
  let componentRef: ComponentRef<ProfilePreviewComponent>;
  let fixture: ComponentFixture<ProfilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePreviewComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('profile', {
      userId: 1,
      firstname: 'Jane',
      lastname: 'Doe',
      username: 'jane_doe',
      bio: 'test bio',
      birthdate: '1990-01-01',
      avatarUrl: 'img/svg/avatar-placeholder.svg',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
