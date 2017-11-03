import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemReportAcceptComponent } from './problem-report-accept.component';

describe('ProblemReportAcceptComponent', () => {
  let component: ProblemReportAcceptComponent;
  let fixture: ComponentFixture<ProblemReportAcceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemReportAcceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemReportAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
