import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGroupComponent } from './control-group.component';

describe('InputGroupComponent', () => {
  let component: ControlGroupComponent;
  let fixture: ComponentFixture<ControlGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
