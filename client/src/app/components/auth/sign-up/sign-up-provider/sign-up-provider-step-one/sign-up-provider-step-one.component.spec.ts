import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpProviderStepOneComponent } from './sign-up-provider-step-one.component';

describe('SignUpProviderStepOneComponent', () => {
  let component: SignUpProviderStepOneComponent;
  let fixture: ComponentFixture<SignUpProviderStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpProviderStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpProviderStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
