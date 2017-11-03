import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { RATING } from '../../constants';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackItemComponent {
  @HostBinding('class.feedback') 1;
  @Input() object: Object;
  @Input() date: string;
  @Output() providerId: EventEmitter<number> = new EventEmitter();
  ratingLvl = RATING.length;

  onProviderClick(id) {
    this.providerId.next(id);
  }
}
