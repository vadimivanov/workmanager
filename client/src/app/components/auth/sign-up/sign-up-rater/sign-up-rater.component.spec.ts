import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpRaterComponent } from './sign-up-rater.component';

describe('SignUpRaterComponent', () => {
  let component: SignUpRaterComponent;
  let fixture: ComponentFixture<SignUpRaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpRaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpRaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
