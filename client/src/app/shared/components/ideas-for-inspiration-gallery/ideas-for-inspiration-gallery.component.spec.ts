import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasForInspirationGalleryComponent } from './ideas-for-inspiration-gallery.component';

describe('IdeasForInspirationGalleryComponent', () => {
  let component: IdeasForInspirationGalleryComponent;
  let fixture: ComponentFixture<IdeasForInspirationGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeasForInspirationGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeasForInspirationGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
