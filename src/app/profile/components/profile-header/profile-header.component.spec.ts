import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeaderComponent } from '@/app/profile/components/profile-header/profile-header.component';

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let componentRef: ComponentRef<ProfileHeaderComponent>;
  let fixture: ComponentFixture<ProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeaderComponent);
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
