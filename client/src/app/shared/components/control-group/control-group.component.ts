import {Component, HostBinding, Input, EventEmitter, Output, HostListener} from '@angular/core';

@Component({
  selector: 'app-control-group',
  templateUrl: './control-group.component.html',
  styleUrls: ['./control-group.component.scss']
})
export class ControlGroupComponent {
  @HostBinding('class.control-group') 1;
  @Input() inputType = 'text';
  @Input() inputPlaceholder = 'placeholder';
  @Input() ico: string | boolean = false;
  @Input() searchValue = '';
  @Output() onSubmit = new EventEmitter();
}
