import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackRequestEventComponent } from './feedback-request-event.component';

describe('FeedbackRequestEventComponent', () => {
  let component: FeedbackRequestEventComponent;
  let fixture: ComponentFixture<FeedbackRequestEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackRequestEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackRequestEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
