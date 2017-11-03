import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasForInspirationPortfolioComponent } from './ideas-for-inspiration-portfolio.component';

describe('IdeasForInspirationPortfolioComponent', () => {
  let component: IdeasForInspirationPortfolioComponent;
  let fixture: ComponentFixture<IdeasForInspirationPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeasForInspirationPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeasForInspirationPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
