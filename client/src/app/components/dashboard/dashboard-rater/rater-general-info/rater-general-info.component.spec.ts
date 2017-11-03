import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaterGeneralInfoComponent } from './rater-general-info.component';

describe('RaterGeneralInfoComponent', () => {
  let component: RaterGeneralInfoComponent;
  let fixture: ComponentFixture<RaterGeneralInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaterGeneralInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaterGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
