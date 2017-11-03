import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderNotificationComponent } from './provider-notification.component';

describe('ProviderNotificationComponent', () => {
  let component: ProviderNotificationComponent;
  let fixture: ComponentFixture<ProviderNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
