import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadeMaskComponent } from './fade-mask.component';

describe('FadeMaskComponent', () => {
  let component: FadeMaskComponent;
  let fixture: ComponentFixture<FadeMaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadeMaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadeMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
