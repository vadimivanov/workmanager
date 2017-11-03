import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContextMenuService, ContextMenuComponent } from 'angular2-contextmenu';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ProviderCompany } from '../../../../shared/models/provider-company.model';
import { PagerService } from '../../../../shared/services/pager/pager.service';
import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { ConfirmDialogComponent } from '../../../../shared/components/modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {
  @ViewChild('searchField') el: ElementRef;
  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;

  formSelect: FormGroup;
  providers: Array<ProviderCompany> = [];
  allItems: Array<ProviderCompany> = [];
  filteredProviders: Array<ProviderCompany> = [];
  providerServices: any[];
  providerSubServicesMap: any[] = [];
  sortBy: string = 'date';
  isSortReverce: boolean = true;
  filterBy: string = '';
  contextMenuFlag: boolean;
  activeRowContextMenu: number;

  pager: any = {};

  pagedItems: any[] = [];
  tableRows = [5, 10, 15, 20];
  currentRows = 5;

  filterCatagories = [{
    value: true,
    name: 'Aktiv'
  }, {
    value: false,
    name: 'Gesperrt'
  }, {
    value: 'prov',
    name: 'Prov'
  }];

  contextOptions = [
    {
      html: (item): string => {
        return item.company_name;
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
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagerService: PagerService,
    private contextMenuService: ContextMenuService,
    private providerServicesService: ProviderServicesService) { }

  ngOnInit() {
    this.setPageContent();

    this.formSelect = this.fb.group({
      valueStatus: '',
      valueCat: ''
    });
  }

  setPageContent() {
    this.providerServicesService.getProviders(null, null, true).subscribe(
      (resp) => {
        if (resp.length) {
          this.providers = resp;
          this.allItems = this.providers;
          this.filteredProviders = this.providers;
          if (this.providers.length) {
            this.sortEntities(this.sortBy, true);
          }
        }
      }
    );
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.providerServices = resp;
        this.createMap(resp, true);
      }
    );
  }

  setPage(page: number) {
    if ((page < 1 || page > this.pager.totalPages) && this.pager.totalPages !== 0) {
      return;
    }
    this.pager = this.pagerService.getPager(this.filteredProviders.length, page, this.currentRows);

    this.pagedItems = this.filteredProviders.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

  createMap(items, service?) {
    for (let i = 0; i < items.length; i++) {
      if (!service) {
        this.providerSubServicesMap.push({
          'id': items[i].id,
          'mapId': items[i].id + (service ? 'service' : 'subService'),
          'name': items[i].name,
          'value': items[i].name,
          'type': service ? 'service' : 'subService',
          'checked': false,
          'parentId': items[i].service_id ? items[i].service_id : undefined
        });
      }
      if (items[i].Subservices && items[i].Subservices.length) {
        this.createMap(items[i].Subservices, false);
      }
    }
  }

  doSearch(): void {
    const val = this.el.nativeElement.value;
    if (!val) {
      this.filteredProviders = this.providers;
      this.setPage(1);
      return;
    }
    this.filteredProviders = this.providers.filter((item) => {
      if (item.company_name) {
        return new RegExp(`${this.el.nativeElement.value}`, 'gi').test(item.company_name.toLowerCase().trim())
      }
    });
    this.setPage(1);
  }

  filterByStatus(status) {
    if (status === 'all') {
      this.filterBy = '';
      this.filteredProviders = this.providers;
    } else if (status === 'prov') {
      this.filteredProviders = this.providers.filter((item) => {
        return item.is_self_registered === false;
      });
    } else if (status) {
      this.filterBy = 'status';
      this.filteredProviders = this.providers.filter((item) => {
        return item.is_enabled === status && item.is_self_registered === status;
      });
    } else {
      this.filterBy = 'status';
      this.filteredProviders = this.providers.filter((item) => {
        return item.is_enabled === false;
      });
    }
    this.sortEntities(this.sortBy, true);
    this.setPage(1);
  }

  filterByService(service) {
    if (service === 'all') {
      this.filterBy = '';
      this.filteredProviders = this.providers;
    } else {
      this.filterBy = 'service';
      this.filteredProviders = this.providers.filter((item) => {
        for (let i = 0; i < item.subServices.length; i++) {
          if (item.subServices[i].name === service) {
            return true;
          }
        }
        return false;
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
        this.filteredProviders.sort(function (a, b) {
          let nameA = a.company_name;
          let nameB = b.company_name;

          if (!nameA && nameB) { return sortDESC; }
          if (nameA && !nameB) { return sortASC; }
          if (!nameA && !nameB) { return 0; }

          nameA = nameA.toLowerCase();
          nameB = nameB.toLowerCase();

          if (nameA > nameB) { return sortDESC; }
          if (nameA < nameB) { return sortASC; }
          return 0;
        });
        break;
      case 'date':
        this.filteredProviders.sort((a, b) => {
          const timeA = new Date(a.created_at).getTime();
          const timeB = new Date(b.created_at).getTime();

          if (timeA > timeB) {
            return sortDESC;
          }
          if (timeA < timeB) {
            return sortASC;
          }
          return 0;
        });
        break;
      case 'status':
        this.filteredProviders.sort(function (a, b) {
          if (a.is_enabled > b.is_enabled) {
            return sortASC;
          }
          if (a.is_enabled < b.is_enabled) {
            return sortDESC;
          }
          return 0;
        });
        break;
      case 'email':
        this.filteredProviders.sort(function (a, b) {
          if (a.email > b.email) { return sortDESC; }
          if (a.email < b.email) { return sortASC; }
          return 0;
        });
        break;
      case 'tel':
        this.filteredProviders.sort(function (a, b) {
          const telA = a.telephone_number;
          const telB = b.telephone_number;

          if (!telA && telB) { return sortDESC; }
          if (telA && !telB) { return sortASC; }
          if (!telA && !telB) { return 0; }

          if (telA > telB) { return sortDESC; }
          if (telA < telB) { return sortASC; }
          return 0;
        });
        break;
      case 'address':
        this.filteredProviders.sort(function (a, b) {
          let addressA = a.locations[0] ? a.locations[0].city : null;
          let addressB = b.locations[0] ? b.locations[0].city : null;

          if (!addressA && addressB) { return sortDESC; }
          if (addressA && !addressB) { return sortASC; }
          if (!addressA && !addressB) { return 0; }

          addressA = addressA.toLowerCase();
          addressB = addressB.toLowerCase();

          if (addressA > addressB) { return sortDESC; }
          if (addressA < addressB) { return sortASC; }
          return 0;
        });
        break;
      case 'category':
        this.filteredProviders.sort(function (a, b) {
          const subServicesA = a.subServices;
          const subServicesB = b.subServices;

          if (subServicesA > subServicesB) { return sortASC; }
          if (subServicesA < subServicesB) { return sortDESC; }
          return 0;
        });
        break;
      case 'plan':
        this.filteredProviders.sort(function (a, b) {
          const planA = (a.stripe_subscription.plan.id).toLowerCase();
          const planB = (b.stripe_subscription.plan.id).toLowerCase();

          if (planA > planB) { return sortDESC; }
          if (planA < planB) { return sortASC; }
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
    this.router.navigate(['provider-profile', item.user_id]);
  }

  public enabledUser(item: any): void {
    this.providerServicesService.editUser(item.user_id, {is_enabled: !item.is_enabled}).subscribe(
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
    this.contextMenuFlag = item.is_enabled;
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
