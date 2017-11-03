import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderGeneralInfoComponent } from './provider-general-info.component';

describe('ProviderGeneralInfoComponent', () => {
  let component: ProviderGeneralInfoComponent;
  let fixture: ComponentFixture<ProviderGeneralInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderGeneralInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
