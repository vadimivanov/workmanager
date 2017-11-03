import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDeclineComponent } from './feedback-decline.component';

describe('FeedbackDeclineComponent', () => {
  let component: FeedbackDeclineComponent;
  let fixture: ComponentFixture<FeedbackDeclineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackDeclineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDeclineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
