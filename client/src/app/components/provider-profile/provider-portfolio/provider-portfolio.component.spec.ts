import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderPortfolioComponent } from './provider-portfolio.component';

describe('ProviderPortfolioComponent', () => {
  let component: ProviderPortfolioComponent;
  let fixture: ComponentFixture<ProviderPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
