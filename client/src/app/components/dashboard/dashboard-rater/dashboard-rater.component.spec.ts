import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRaterComponent } from './dashboard-rater.component';

describe('DashboardRaterComponent', () => {
  let component: DashboardRaterComponent;
  let fixture: ComponentFixture<DashboardRaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
