import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpProviderStepThreeComponent } from './sign-up-provider-step-three.component';

describe('SignUpProviderStepThreeComponent', () => {
  let component: SignUpProviderStepThreeComponent;
  let fixture: ComponentFixture<SignUpProviderStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpProviderStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpProviderStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
