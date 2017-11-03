import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePromoComponent } from './profile-promo.component';

describe('ProfilePromoComponent', () => {
  let component: ProfilePromoComponent;
  let fixture: ComponentFixture<ProfilePromoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePromoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
