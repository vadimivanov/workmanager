import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  @HostBinding('class.user-info') 1;
  @Input() photo_url: string;
  @Input() first_name: string;
  @Input() last_name: string;
  @Input() occupation: string;
  @Input() contacts: string[];
}
