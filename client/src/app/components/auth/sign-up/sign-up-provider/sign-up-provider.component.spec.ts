import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpProviderComponent } from './sign-up-provider.component';

describe('SignUpProviderComponent', () => {
  let component: SignUpProviderComponent;
  let fixture: ComponentFixture<SignUpProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
