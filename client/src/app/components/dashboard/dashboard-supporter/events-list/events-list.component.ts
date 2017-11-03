import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ContextMenuService, ContextMenuComponent } from 'angular2-contextmenu';
import { Router, ActivatedRoute } from '@angular/router';

import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';
import { PagerService } from '../../../../shared/services/pager/pager.service';
import { ProblemReportComponent } from '../../../../shared/components/modals/problem-report/problem-report.component';
import { PortfolioEventComponent } from '../../../../shared/components/modals/portfolio-event/portfolio-event.component';
import { FeedbackEventComponent } from '../../../../shared/components/modals/feedback-event/feedback-event.component';
import { FeedbackRequestEventComponent } from '../../../../shared/components/modals/feedback-request-event/feedback-request-event.component';
import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { DialogService } from '../../../../shared/services/dialog/dialog.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {

  providerSubServicesMap: any[] = [];
  pager: any = {};
  pagedItems: any[] = [];
  allItems: any[] = [];
  tempCollection: any[] = [];
  tableRows = [5, 10, 15, 20];
  currentRows = 5;
  filters = {
    type: [],
    typeList: [],
    initiation_role_name: [],
    initiation_role_nameList: []
  };
  sorteredAllItems: any[] = [];
  loadCounter: number = 0;
  sortBy: string = 'date';
  isSortReverce: boolean = true;
  filterBy: string = '';
  userId: number;
  roles = {
    rater: 'Rater',
    provider: 'Provider'
  };

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;

  constructor(
    private router: Router,
    private providerServicesService: ProviderServicesService,
    public dialog: MdDialog,
    private pagerService: PagerService,
    private dialogService: DialogService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.allItems = [];
    const multy = Observable.forkJoin(
      this.notificationsService.getFeedbackNotifications(),
      // this.notificationsService.getFeedbackRequest(),
      this.notificationsService.getProblemsReports(),
      this.notificationsService.getPortfolioNotifications()
    );
    multy.subscribe(
      (resp) => {
        for (let i = 0; i < resp.length; i++) {
          const obj = resp[i];
          for (let j = 0; j < obj.length; j++) {
            if (obj[j]) {
            obj[j].status = !obj[j].is_viewed ? 1 : (obj[j].is_approved ? 2 : 3);
            this.allItems.push(obj[j]);
            }
          }
        }
        this.sorteredAllItems = this.allItems;
        this.tempCollection = this.allItems;
        this.createFilteredLists('type');
        this.createFilteredLists('initiation_role_name');
        this.sortEntities(this.sortBy, true);
      })
  }

  createFilteredLists(filter) {
    for (let i = 0; i < this.tempCollection.length; i++) {
      if (this.filters[filter].indexOf(this.tempCollection[i][filter]) < 0) {
        this.filters[filter].push(this.tempCollection[i][filter]);
        this.filters[filter + 'List'].push({
          value: this.tempCollection[i][filter],
          name: filter === 'type' ? this.getEventType(this.tempCollection[i][filter]) : this.tempCollection[i][filter]
        });
      }
    }
  }

  setPage(page: number) {
    if ((page < 1 || page > this.pager.totalPages) && this.pager.totalPages !== 0) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page, this.currentRows);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

  getEventStatus(status) {
    return status ? 'Genehmigt' : 'Abgelehnt';
  }

  getEventType(type) {
    const typeList = {
      problem: 'Problemmeldung',
      portfolio: 'Neue Beispielbilder',
      feedbacks: 'Neue Bewertung',
      request: 'Bewertung anfragen'
    };
    return typeList[type];
  }

  openDialog(data) {
    if (data.type === 'problem') {
      const dialogRef = this.dialog.open(ProblemReportComponent);
      dialogRef.componentInstance.content = data;
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.msg) {
          this.loadNotifications();
        }
      });
    }
    if (data.type === 'portfolio') {
      const dialogRef = this.dialog.open(PortfolioEventComponent);
      dialogRef.componentInstance.content = data;
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.msg) {
          this.loadNotifications();
        }
      });
    }
    if (data.type === 'feedbacks') {
      const dialogRef = this.dialog.open(FeedbackEventComponent);
      dialogRef.componentInstance.content = data;
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.msg) {
          this.loadNotifications();
        }
      });
    }
    if (data.type === 'request') {
      const dialogRef = this.dialog.open(FeedbackRequestEventComponent);
      dialogRef.componentInstance.content = data;
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.msg) {
          this.loadNotifications();
        }
      });
    }

  }

  filterByStatus(status, key) {
    if (status === 'all') {
      this.filterBy = '';
      this.allItems = this.tempCollection;
    } else {
      this.filterBy = key;
      this.allItems = this.tempCollection.filter((item) => {
        return item[key] === status;
      });
    }
    this.sorteredAllItems = this.allItems;
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
      case 'type':
        this.sorteredAllItems.sort((a, b) => {
          const typeA = this.getEventType(a.type);
          const typeB = this.getEventType(b.type);

          if (typeA > typeB) { return sortDESC; }
          if (typeA < typeB) { return sortASC; }
          return 0;
        });
        break;
      case 'date':
        this.sorteredAllItems.sort((a, b) => {
          const timeA = new Date(a.created_at).getTime();
          const timeB = new Date(b.created_at).getTime();

          if (timeA > timeB) { return sortDESC; }
          if (timeA < timeB) { return sortASC; }
          return 0;
        });
        break;
      case 'role':
        this.sorteredAllItems.sort((a, b) => {
          if (a.initiation_role_name > b.initiation_role_name) { return sortDESC; }
          if (a.initiation_role_name < b.initiation_role_name) { return sortASC; }
          return 0;
        });
        break;
      case 'name':
        this.sorteredAllItems.sort((a, b) => {
          const nameA = a.Provider ? a.Provider.company_name : a.Rater.first_name + ' ' + a.Rater.last_name;
          const nameB = b.Provider ? b.Provider.company_name : b.Rater.first_name + ' ' + b.Rater.last_name;

          if (nameA > nameB) { return sortDESC; }
          if (nameA < nameB) { return sortASC; }
          return 0;
        });
        break;
      case 'status':
        this.sorteredAllItems.sort((a, b) => {
          if (a.status > b.status) { return sortDESC; }
          if (a.status < b.status) { return sortASC; }
          return 0;
        });
        break;
    }

    this.setPage(1);
  }

  getProviderName(provider, defaultText) {
    return provider.company_name || defaultText;
  }

  getRaterName(rater, defaultText) {
    let name = rater.first_name ? rater.first_name + ' ' : '';
    name += rater.last_name ? rater.last_name : '';

    return name.length ? name : defaultText;
  }

}
