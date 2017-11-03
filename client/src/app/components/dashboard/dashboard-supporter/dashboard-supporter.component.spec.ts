import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSupporterComponent } from './dashboard-supporter.component';

describe('DashboardSupporterComponent', () => {
  let component: DashboardSupporterComponent;
  let fixture: ComponentFixture<DashboardSupporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSupporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSupporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
