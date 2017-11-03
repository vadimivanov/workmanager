import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';

import { InfoDialogComponent } from '../../shared/components/modals/info-dialog/info-dialog.component';
import { ProviderSearchService } from '../../shared/services/provider-search/provider-search.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  searchCategory: any;
  queryParams: any;
  providerServices: Array<any> = [];
  searchResults: Array<any> = [];
  searchConfig: Array<any> = [];
  displayingQuotesList = [
    {
      photo_url: 'assets/scss/images/img17.jpg',
      first_name: 'John',
      last_name: 'Smith',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      photo_url: 'assets/scss/images/img17.jpg',
      first_name: 'John',
      last_name: 'Smith',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      photo_url: 'assets/scss/images/img17.jpg',
      first_name: 'John',
      last_name: 'Smith',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      photo_url: 'assets/scss/images/img17.jpg',
      first_name: 'John',
      last_name: 'Smith',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  ];

  constructor(
    public dialog: MdDialog,
    private providerSearchService: ProviderSearchService,
    private router: Router
  ) { }

  goToCategories() {
    this.router.navigate(['categories']);
  }

  goToSearchResults(value) {
    this.clearSearchParams();
    this.searchCategory = {searchKey: 'serviceName', searchValue: value};
    this.search();
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
          this.openDialog();
        }
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
}
