import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent {
  @HostBinding('class.member') 1;
  @Input() img: string;
  @Input() title: string;
  @Input() description: string;
  @Input() isEditable: boolean;
  @Output() toEdit = new EventEmitter();
  @Output() toDelete = new EventEmitter();
}
