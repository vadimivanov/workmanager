import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStepsComponent } from './register-steps.component';

describe('RegisterStepsComponent', () => {
  let component: RegisterStepsComponent;
  let fixture: ComponentFixture<RegisterStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
