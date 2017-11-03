import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestProvidersComponent } from './latest-providers.component';

describe('LatestProvidersComponent', () => {
  let component: LatestProvidersComponent;
  let fixture: ComponentFixture<LatestProvidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestProvidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
