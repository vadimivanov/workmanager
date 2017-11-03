import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  infoText: string;

  constructor(
    public dialogRef: MdDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit() {
  }
  confirm() {
    this.dialogRef.close({ msg: 'confirm' });
  }
  cancel() {
    this.dialogRef.close(true);
  }

}
