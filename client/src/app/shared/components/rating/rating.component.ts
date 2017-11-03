import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { RATING } from '../../constants';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @HostBinding('class.rating') 1;
  @Input() id?: any;
  @Input() obj?: object;
  @Input() value = 0;
  @Input() starAmount = RATING;
  @Input() cb: void;
  @Input() isDigitalValueShow = [false, false];
  @Input() isPresentation = false;
  @Input() markAmount: number;
  @Input() feedCount: number;
  @Input() type: string;
  public isVisible: boolean = true;

  ngOnInit() {
    if (this.type === 'promo') {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }
}
