import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAlertComponent } from './user-alert.component';

describe('UserAlertComponent', () => {
  let component: UserAlertComponent;
  let fixture: ComponentFixture<UserAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
