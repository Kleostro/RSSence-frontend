import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBioComponent } from '@/app/profile/components/profile-bio/profile-bio.component';

describe('ProfileBioComponent', () => {
  let component: ProfileBioComponent;
  let componentRef: ComponentRef<ProfileBioComponent>;
  let fixture: ComponentFixture<ProfileBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileBioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileBioComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('bio', 'test');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
