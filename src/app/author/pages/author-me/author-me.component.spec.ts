import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';

import { AuthorMeComponent } from '@/app/author/pages/author-me/author-me.component';

describe('AuthorMeComponent', () => {
  let component: AuthorMeComponent;
  let fixture: ComponentFixture<AuthorMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorMeComponent],
      providers: [
        provideHttpClient(),
        { provide: MessageService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
