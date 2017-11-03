import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  @Input() infoImgUrl: string;
  @HostBinding('class.info') 1;
}
