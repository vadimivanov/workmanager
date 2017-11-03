import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioEventComponent } from './portfolio-event.component';

describe('PortfolioEventComponent', () => {
  let component: PortfolioEventComponent;
  let fixture: ComponentFixture<PortfolioEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
