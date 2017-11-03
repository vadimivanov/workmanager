import {
  Component, OnInit, Input, Output, EventEmitter, DoCheck, ElementRef, ViewChild,
  HostBinding
} from '@angular/core';

@Component({
  selector: 'app-editable-info',
  templateUrl: './editable-info.component.html',
  styleUrls: ['./editable-info.component.scss']
})
export class EditableInfoComponent implements OnInit {
  @HostBinding('class.editable-info') 1;
  @Input()
  toEdit: any;
  @Input()
  textEdit: string;
  @Input()
  headerEdit: string;
  editMode = false;

  @Output()
  saveEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  save() {
    this.editMode = !this.editMode;
    this.saveEvent.emit(this.toEdit);
  }

  saveMembers(val) {
    if (val > 0) {
      this.editMode = !this.editMode;
      this.saveEvent.emit(this.toEdit);
    }    
  }

  cancel() {
    this.editMode = !this.editMode;
  }

  edit() {
    this.editMode = !this.editMode;
  }

  remove() {
    this.saveEvent.emit('remove');
  }

  isEmptyFields(...fields) {
    return fields.every(el => {
      return !el;
    });
  }
}
