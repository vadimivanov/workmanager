import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaterListComponent } from './rater-list.component';

describe('RaterListComponent', () => {
  let component: RaterListComponent;
  let fixture: ComponentFixture<RaterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
