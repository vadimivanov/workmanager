import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderStaffComponent } from './provider-staff.component';

describe('ProviderStaffComponent', () => {
  let component: ProviderStaffComponent;
  let fixture: ComponentFixture<ProviderStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
