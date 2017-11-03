import {Component, HostBinding, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent {
  @HostBinding('class.search-item') 1;
  @Input() id: string;
  @Input() img: string;
  @Input() isHideImg: boolean;
  @Input() title: string;
  @Input() description: string;
  @Input() rating: string;
  @Input() plan: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  goToProfile(id) {
    this.router.navigate(['provider-profile', id]);
  }
}
