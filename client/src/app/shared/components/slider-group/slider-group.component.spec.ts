import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderGroupComponent } from './slider-group.component';

describe('SliderGroupComponent', () => {
  let component: SliderGroupComponent;
  let fixture: ComponentFixture<SliderGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
