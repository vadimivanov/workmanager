import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent {
  @HostBinding('class.categories__list') 1;
  subcategories = [];
  goToSearchResults: Function;
  modal: any;

  clickCategory(searchKey, value) {
    this.goToSearchResults(searchKey, value);
    this.modal.close();
  }
}
