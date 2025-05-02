import { ComponentFixture, TestBed } from '@angular/core/testing';

// eslint-disable-next-line max-len
import { ProfileFormWrapperComponent } from '@/app/profile/components/profile-form-wrapper/profile-form-wrapper.component';

describe('ProfileFormWrapperComponent', () => {
  let component: ProfileFormWrapperComponent;
  let fixture: ComponentFixture<ProfileFormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFormWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
