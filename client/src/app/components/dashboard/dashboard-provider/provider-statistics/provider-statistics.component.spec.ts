import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderStatisticsComponent } from './provider-statistics.component';

describe('ProviderStatisticsComponent', () => {
  let component: ProviderStatisticsComponent;
  let fixture: ComponentFixture<ProviderStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
