import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaterPasswordComponent } from './rater-password.component';

describe('RaterPasswordComponent', () => {
  let component: RaterPasswordComponent;
  let fixture: ComponentFixture<RaterPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaterPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaterPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
