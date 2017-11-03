import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaterFeedbacksComponent } from './rater-feedbacks.component';

describe('RaterFeedbacksComponent', () => {
  let component: RaterFeedbacksComponent;
  let fixture: ComponentFixture<RaterFeedbacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaterFeedbacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaterFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
