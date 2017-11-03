import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderPasswordComponent } from './provider-password.component';

describe('ProviderPasswordComponent', () => {
  let component: ProviderPasswordComponent;
  let fixture: ComponentFixture<ProviderPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
