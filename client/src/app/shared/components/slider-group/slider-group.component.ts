import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-slider-group',
  templateUrl: './slider-group.component.html',
  styleUrls: ['./slider-group.component.scss']
})
export class SliderGroupComponent {
  @HostBinding('class.slider-group') 1;
}
