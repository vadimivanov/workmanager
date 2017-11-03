import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaterProfileComponent } from './rater-profile.component';

describe('RaterProfileComponent', () => {
  let component: RaterProfileComponent;
  let fixture: ComponentFixture<RaterProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaterProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
