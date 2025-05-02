import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorFormWrapperComponent } from '@/app/author/components/author-form-wrapper/author-form-wrapper.component';

describe('AuthorFormWrapperComponent', () => {
  let component: AuthorFormWrapperComponent;
  let fixture: ComponentFixture<AuthorFormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorFormWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
