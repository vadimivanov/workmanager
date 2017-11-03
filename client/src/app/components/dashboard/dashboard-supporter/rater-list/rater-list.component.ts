import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ContextMenuService, ContextMenuComponent } from 'angular2-contextmenu';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { PagerService } from '../../../../shared/services/pager/pager.service';
import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { ConfirmDialogComponent } from '../../../../shared/components/modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-rater-list',
  templateUrl: './rater-list.component.html',
  styleUrls: ['./rater-list.component.scss']
})
export class RaterListComponent implements OnInit {
  @ViewChild('searchField') el: ElementRef;
  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @Input()
  raters: any[] = [];
  allItems: any[] = [];
  filteredRaters: any[] = [];
  sortBy: string = 'date';
  isSortReverce: boolean = true;
  contextMenuFlag: boolean;
  activeRowContextMenu: number;

  pager: any = {};

  pagedItems: any[] = [];
  tableRows = [5, 10, 15, 20];
  currentRows = 5;
  // statusSorting: any;

  contextOptions = [
    {
      html: (item): string => {
        return `${item.first_name}  ${item.last_name}`;
      }
    }, {
      html: (item): string => 'Anzeigen',
      click: (item) => {
        this.goToProfile(item);
      }
    }, {
      html: (item): string => {
        return this.contextMenuFlag ? 'Zugang sperren' : 'Aktiv setzen';
      },
      click: (item) => {
        this.enabledUser(item);
      }
    }, {
      html: (item): string => 'Löschen',
      click: (item) => {
        this.confirmDialog(item);
      }
    }
  ];

  constructor(
    public dialog: MdDialog,
    private router: Router,
    private route: ActivatedRoute,
    private contextMenuService: ContextMenuService,
    private pagerService: PagerService,
    private providerServicesService: ProviderServicesService) { }

  ngOnInit() {
    this.setPageContent();
  }

  setPageContent() {
    this.providerServicesService.getRaters().subscribe(
      (resp) => {
        if (resp.length) {
          this.raters = resp;
          this.filteredRaters = this.raters;
          this.allItems = this.raters;
          this.sortEntities(this.sortBy, true);
          this.setPage(1);
        }
      }
    );
  }

  setPage(page: number) {
    if ((page < 1 || page > this.pager.totalPages) && this.pager.totalPages !== 0) {
      return;
    }

    this.pager = this.pagerService.getPager(this.filteredRaters.length, page, this.currentRows);

    this.pagedItems = this.filteredRaters.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getPagesRange() {
    let rangeFrom = (this.pager.currentPage - 1 ) * this.currentRows + 1;
    let rangeTo = this.pager.currentPage * this.currentRows;

    rangeTo = rangeTo > this.allItems.length ? this.allItems.length : rangeTo;

    return `${rangeFrom ? rangeFrom : 0}-${rangeTo ? rangeTo : 0}`;
  }

  setTableRows(rows) {
    this.currentRows = rows;
    this.setPage(1);
  }

  doSearch(): void {
    const val = this.el.nativeElement.value;
    if (!val) {
      this.filteredRaters = this.raters;
      this.setPage(1);
      return;
    }
    this.filteredRaters = this.raters.filter((item) => {
      return new RegExp(`${this.el.nativeElement.value}`, 'gi').test((item.first_name + ' ' + item.last_name).toLowerCase().trim())
    });
    this.setPage(1);
  }

  filterByStatus(status) {
    if (status === 'all') {
      this.filteredRaters = this.raters;
    } else {
      this.filteredRaters = this.raters.filter((item) => {
        return item.User.is_enabled === status;
      });
    }
    this.sortEntities(this.sortBy, true);
    this.setPage(1);
  }

  isSortBy(param) {
    return this.sortBy === param;
  }


  sortEntities(param, isReSort?) {
    if (!isReSort) {
      if (this.isSortBy(param)) {
        this.isSortReverce = !this.isSortReverce;
      } else {
        this.isSortReverce = false;
      }
    }

    const sortASC = this.isSortReverce ? 1 : -1;
    const sortDESC = this.isSortReverce ? -1 : 1;

    this.sortBy = param;

    switch (param) {
      case 'name':
        this.filteredRaters.sort(function (a, b) {
          if ((a.first_name + ' ' + a.last_name).toLowerCase() > (b.first_name + ' ' + b.last_name).toLowerCase()) {
            return sortDESC;
          }
          if ((a.first_name + ' ' + a.last_name).toLowerCase() < (b.first_name + ' ' + b.last_name).toLowerCase()) {
            return sortASC;
          }
          return 0;
        });
        break;
      case 'date':
        this.filteredRaters.sort((a, b) => {
          const timeA = new Date(a.created_at).getTime();
          const timeB = new Date(b.created_at).getTime();

          if (timeA > timeB) { return sortDESC; }
          if (timeA < timeB) { return sortASC; }
          return 0;
        });
        break;
      case 'status':
        this.filteredRaters.sort(function (a, b) {
          if (a.User.is_enabled > b.User.is_enabled) {
            return sortDESC;
          }
          if (a.User.is_enabled < b.User.is_enabled) {
            return sortASC;
          }
          return 0;
        });
        break;
      case 'feedback':
        this.filteredRaters.sort(function (a, b) {
          if (a.Feedbacks.length > b.Feedbacks.length) {
            return sortDESC;
          }
          if (a.Feedbacks.length < b.Feedbacks.length) {
            return sortASC;
          }
          return 0;
        });
        break;
      case 'email':
        this.filteredRaters.sort(function (a, b) {
          if (a.User.email > b.User.email) {
            return sortDESC;
          }
          if (a.User.email < b.User.email) {
            return sortASC;
          }
          return 0;
        });
        break;
      case 'address':
        this.filteredRaters.sort(function (a, b) {
          if ((a.city).toLowerCase() > (b.city).toLowerCase()) {
            return sortDESC;
          }
          if ((a.city).toLowerCase() < (b.city).toLowerCase()) {
            return sortASC;
          }
          return 0;
        });
        break;
    }

    this.setPage(1);
  }

  isActiveRow (rowNumber) {
    return rowNumber === this.activeRowContextMenu;
  }

  public goToProfile(item: any): void {
    this.router.navigate(['rater-profile', item.user_id]);
  }

  public enabledUser(item: any): void {
    this.providerServicesService.editUser(item.user_id, {is_enabled: !item.User.is_enabled}).subscribe(
      (resp) => {
        this.setPageContent();
      }
    );
  }

  public deleteUser(item: any): void {
    this.providerServicesService.deleteUser(item.user_id).subscribe(
      (resp) => {
        this.setPageContent();
      }
    );
  }

  public onContextMenu($event: MouseEvent, item: any, rowNumber: number): void {
    this.activeRowContextMenu = rowNumber;
    this.contextMenuFlag = item.User.is_enabled;
    this.contextMenuService.show.next({ actions: this.contextOptions, event: $event, item: item });
    $event.preventDefault();
  }

  public processContextMenuCloseEvent() {
    this.activeRowContextMenu = -1;
  }

  confirmDialog(item): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.infoText = 'Are you sure you want to delete this user, after confirmation the user will be removed completely without opportunity for recovery';
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.msg) {
        this.deleteUser(item);
      }
    });
  }
}
