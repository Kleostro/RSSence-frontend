import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoauthorsListComponent } from '@/app/post/components/coauthors-list/coauthors-list.component';

describe('CoauthorsListComponent', () => {
  let component: CoauthorsListComponent;
  let fixture: ComponentFixture<CoauthorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoauthorsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoauthorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
