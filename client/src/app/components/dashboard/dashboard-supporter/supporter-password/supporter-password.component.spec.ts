import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupporterPasswordComponent } from './supporter-password.component';

describe('SupporterPasswordComponent', () => {
  let component: SupporterPasswordComponent;
  let fixture: ComponentFixture<SupporterPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupporterPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupporterPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
