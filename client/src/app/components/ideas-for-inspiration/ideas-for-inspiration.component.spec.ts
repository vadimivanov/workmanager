import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasForInspirationComponent } from './ideas-for-inspiration.component';

describe('IdeasForInspirationComponent', () => {
  let component: IdeasForInspirationComponent;
  let fixture: ComponentFixture<IdeasForInspirationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeasForInspirationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeasForInspirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
