import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-cutaway',
  templateUrl: './cutaway.component.html',
  styleUrls: ['./cutaway.component.scss']
})
export class CutawayComponent {
  @HostBinding('class.cutaway') 1;
  @HostBinding('class.block') 2;
  @Input() img: string;
  @Input() title: string;
  @Input() items: string[];
}
