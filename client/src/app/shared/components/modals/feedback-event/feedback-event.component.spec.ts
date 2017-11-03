import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackEventComponent } from './feedback-event.component';

describe('FeedbackEventComponent', () => {
  let component: FeedbackEventComponent;
  let fixture: ComponentFixture<FeedbackEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
