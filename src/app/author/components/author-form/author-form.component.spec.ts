import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';

import { AuthorFormComponent } from '@/app/author/components/author-form/author-form.component';

describe('AuthorFormComponent', () => {
  let component: AuthorFormComponent;
  let fixture: ComponentFixture<AuthorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorFormComponent],
      providers: [
        provideHttpClient(),
        {
          provide: MessageService,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
