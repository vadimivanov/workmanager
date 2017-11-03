import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProviderComponent } from './dashboard-provider.component';

describe('DashboardProviderComponent', () => {
  let component: DashboardProviderComponent;
  let fixture: ComponentFixture<DashboardProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
