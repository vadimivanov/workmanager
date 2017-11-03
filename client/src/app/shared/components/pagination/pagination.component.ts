import {Component, HostBinding, Input} from '@angular/core';
import {PagerService} from '../../services/pager/pager.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @HostBinding('class.pagination') 1;
  @Input() pager: any = {};
  private allItems: any[];
  pagedItems: any[];

  constructor(private pagerService: PagerService) {}
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
