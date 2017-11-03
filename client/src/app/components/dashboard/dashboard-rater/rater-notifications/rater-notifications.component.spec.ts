import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaterNotificationsComponent } from './rater-notifications.component';

describe('RaterNotificationsComponent', () => {
  let component: RaterNotificationsComponent;
  let fixture: ComponentFixture<RaterNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaterNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaterNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
