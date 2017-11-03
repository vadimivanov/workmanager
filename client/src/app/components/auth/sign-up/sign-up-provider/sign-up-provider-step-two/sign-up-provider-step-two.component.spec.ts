import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpProviderStepTwoComponent } from './sign-up-provider-step-two.component';

describe('SignUpProviderStepTwoComponent', () => {
  let component: SignUpProviderStepTwoComponent;
  let fixture: ComponentFixture<SignUpProviderStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpProviderStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpProviderStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
