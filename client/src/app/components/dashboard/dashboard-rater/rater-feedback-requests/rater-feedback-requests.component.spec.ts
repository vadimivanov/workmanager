import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaterFeedbackRequestsComponent } from './rater-feedback-requests.component';

describe('RaterFeedbackRequestsComponent', () => {
  let component: RaterFeedbackRequestsComponent;
  let fixture: ComponentFixture<RaterFeedbackRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaterFeedbackRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaterFeedbackRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
