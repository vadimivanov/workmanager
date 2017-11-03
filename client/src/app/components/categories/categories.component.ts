import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MasonryOptions } from 'angular2-masonry';
import { MdDialog } from '@angular/material';

import { InfoDialogComponent } from '../../shared/components/modals/info-dialog/info-dialog.component';
import { ProviderServicesService } from '../../shared/services/provider-services/provider-services.service';
import { ProviderServices } from '../../shared/models/provider-services.model';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { ProviderSearchService } from '../../shared/services/provider-search/provider-search.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  searchResults: Array<any> = [];
  searchCategory: any;
  queryParams: any;
  providerServices: Array<any> = [];
  categoriesList: ProviderServices[];
  layoutOption: MasonryOptions = {
    gutter: 30
  };
  searchConfig: any = [];
  isLoad = false;

  constructor(
    private router: Router,
    private providerSearchService: ProviderSearchService,
    private providerServicesService: ProviderServicesService,
    public dialog: MdDialog
  ) {}

  ngOnInit() {
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.categoriesList = resp;
      },
      (error) => console.log('error - getServices', error)
    );
  }

  goToSearchResults(searchKey, value) {
    if (!this.isLoad) {
      this.isLoad = true;
      this.clearSearchParams();
      this.searchCategory = {searchKey: searchKey, searchValue: value};
      this.search();
    }
  }

  clearSearchParams(): void {
    this.searchCategory = '';
    this.searchConfig = [];
  }

  search(): void {
    if (this.searchCategory) {
      this.searchConfig.push(this.searchCategory);
    }

    this.providerSearchService.mainSearch(this.searchConfig).subscribe(
      (resp) => {
        if (resp) {
          this.searchResults = resp;
          this.router.navigate(['search-result'], {
            queryParams: {
              searchResults: JSON.stringify(this.searchResults),
              searchParams: JSON.stringify(this.searchConfig)
            }
          });
          this.clearSearchParams();
        } else {
          this.dialog.closeAll();
          this.openDialog();
        }
        this.isLoad = false;
      },
      (error) => {
        this.clearSearchParams();
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Es gibt keine Dienstleister in dieser Kategorie';
  }

  openModal(category) {
    const modalRef = this.dialog.open(CategoriesListComponent, {height: '90vh'});
    modalRef.componentInstance.subcategories = category.Subservices;
    modalRef.componentInstance.goToSearchResults = this.goToSearchResults.bind(this);
    modalRef.componentInstance.modal = modalRef;
  }
}
