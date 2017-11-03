import {Component, HostBinding, Input, Output, OnChanges, OnInit, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnChanges, OnInit {
  @HostBinding('class.filter-block') 1;

  @Input() title: string;
  @Input() list: any;
  @Input() isActive: boolean = false;
  @Input() isWider: boolean = false;
  @Input() isWidest: boolean = false;
  @Input() isAllItem: boolean = true;
  @Input() defaultItem: any;

  @Output() onSelectItem: EventEmitter<string> = new EventEmitter<string>();

  isOpen: boolean = false;
  selectedValue: string;
  selectedName: string;

  ngOnInit() {
    this.clear();
  }

  ngOnChanges(changes: any) {
    if ( changes.isActive
         && !changes.isActive.currentValue
         && changes.isActive.previewValue !== undefined) {
      this.clear();
    }
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  clear () {
    if (this.defaultItem) {
      this.selectedName = this.defaultItem.name;
      this.selectedValue = this.defaultItem.value;
    } else if (!this.isAllItem) {
      this.selectedName = this.list[0].name;
      this.selectedValue = this.list[0].value;
    } else {
      this.selectedName = 'Alle';
      this.selectedValue = 'all';
    }
    this.isOpen = false;
  }

  isActiveItem (value) {
    return this.selectedValue === value;
  }

  selectItem (value, name) {
    this.selectedName = name;
    this.selectedValue = value;
    this.isOpen = false;

    this.onSelectItem.emit(value);
  }
}
