import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CutawayComponent } from './cutaway.component';

describe('CutawayComponent', () => {
  let component: CutawayComponent;
  let fixture: ComponentFixture<CutawayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CutawayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CutawayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
