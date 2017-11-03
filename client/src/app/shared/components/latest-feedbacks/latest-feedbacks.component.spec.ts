import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestFeedbacksComponent } from './latest-feedbacks.component';

describe('LatestFeedbacksComponent', () => {
  let component: LatestFeedbacksComponent;
  let fixture: ComponentFixture<LatestFeedbacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestFeedbacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
