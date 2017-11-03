import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShifterComponent } from './shifter.component';

describe('ShifterComponent', () => {
  let component: ShifterComponent;
  let fixture: ComponentFixture<ShifterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShifterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShifterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
