import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSubscriptionComponent } from './provider-subscription.component';

describe('ProviderSubscriptionComponent', () => {
  let component: ProviderSubscriptionComponent;
  let fixture: ComponentFixture<ProviderSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
