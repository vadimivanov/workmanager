import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksRaterComponent } from './how-it-works-rater.component';

describe('HowItWorksRaterComponent', () => {
  let component: HowItWorksRaterComponent;
  let fixture: ComponentFixture<HowItWorksRaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowItWorksRaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksRaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
