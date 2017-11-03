import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditablePopupComponent } from './editable-popup.component';

describe('EditablePopupComponent', () => {
  let component: EditablePopupComponent;
  let fixture: ComponentFixture<EditablePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditablePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditablePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
