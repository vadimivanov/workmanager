import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksProviderComponent } from './how-it-works-provider.component';

describe('HowItWorksProviderComponent', () => {
  let component: HowItWorksProviderComponent;
  let fixture: ComponentFixture<HowItWorksProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowItWorksProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
