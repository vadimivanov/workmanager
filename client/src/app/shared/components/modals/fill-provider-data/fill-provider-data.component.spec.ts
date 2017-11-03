import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillProviderDataComponent } from './fill-provider-data.component';

describe('FillProviderDataComponent', () => {
  let component: FillProviderDataComponent;
  let fixture: ComponentFixture<FillProviderDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillProviderDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillProviderDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
