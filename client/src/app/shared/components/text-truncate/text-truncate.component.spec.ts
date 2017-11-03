import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTruncateComponent } from './text-truncate.component';

describe('TextTruncateComponent', () => {
  let component: TextTruncateComponent;
  let fixture: ComponentFixture<TextTruncateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextTruncateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTruncateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
