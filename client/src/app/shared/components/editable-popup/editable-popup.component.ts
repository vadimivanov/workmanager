import { Component, OnInit } from '@angular/core';
import { PagerService } from '../../../shared/services/pager/pager.service';
import { ProfileService } from '../../../shared/services/profile/profile.service';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-editable-popup',
  templateUrl: './editable-popup.component.html',
  styleUrls: ['./editable-popup.component.scss']
})
export class EditablePopupComponent implements OnInit {

  userId: number;
  userRole: string;
  list: any;
  displayList: any;

  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(
    private profileService: ProfileService,
    private dialogRef: MdDialogRef<EditablePopupComponent>,
    private pagerService: PagerService) { }

  ngOnInit() {
    // set items to json response
    this.allItems = this.list;

    // initialize to page 1
    this.setPage(1);
  }

  updateCheckedOptions(key, index, event) {
    const model = this.pagedItems[index];
    model.is_displaying_quote = event.checked;
  }
  updateQuotes(event) {
    event.preventDefault();
    const newDisplayList = [];
    for (let i = 0; i < this.list.length; i++) {
      const feedback = this.list[i];
      if (feedback.is_displaying_quote) {
        newDisplayList.push(feedback);
      }
      this.profileService.editFeedback(this.userId, this.userRole, feedback.id, {is_displaying_quote: feedback.is_displaying_quote}).subscribe(
        (resp) => {}
      );
    }
    this.dialogRef.close({ msg: 'update', displayList: newDisplayList });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page, 3);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
