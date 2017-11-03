import { Observable } from 'rxjs/Rx';
import { UploadPhotoComponent } from '../../components/modals/upload-photo/upload-photo.component';
import { ConfirmDialogComponent } from '../../components/modals/confirm-dialog/confirm-dialog.component';
import { FillProviderDataComponent } from '../../components/modals/fill-provider-data/fill-provider-data.component';
import { InfoDialogComponent } from '../../components/modals/info-dialog/info-dialog.component';
import { ProblemReportComponent } from '../../components/modals/problem-report/problem-report.component';
import { PortfolioEventComponent } from '../../components/modals/portfolio-event/portfolio-event.component';
import { FeedbackEventComponent } from '../../components/modals/feedback-event/feedback-event.component';
import { FeedbackDeclineComponent } from '../../components/modals/feedback-decline/feedback-decline.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {

  constructor(private dialog: MdDialog) { }

  public uploadPhotoDialog(data: any): Observable<any> {

    let dialogRef: MdDialogRef<UploadPhotoComponent>;

    dialogRef = this.dialog.open(UploadPhotoComponent);
    dialogRef.componentInstance.content = data;

    return dialogRef.afterClosed();
  }

  public removeMember(data: any): Observable<boolean> {

    let dialogRef: MdDialogRef<ConfirmDialogComponent>;

    dialogRef = this.dialog.open(ConfirmDialogComponent);


    return dialogRef.afterClosed();
  }

  public fillProviderData(data: any) {
    let dialogRef: MdDialogRef<FillProviderDataComponent>;

    dialogRef = this.dialog.open(FillProviderDataComponent);

    return dialogRef.afterClosed();
  }

  public infoDialog(data: any) {
    let dialogRef: MdDialogRef<InfoDialogComponent>;

    dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = data;

    return dialogRef.afterClosed();
  }

  public reportDialog(data: any) {
    let dialogRef: MdDialogRef<ProblemReportComponent>;

    dialogRef = this.dialog.open(ProblemReportComponent);
    dialogRef.componentInstance.content = data;

    return dialogRef.afterClosed();
  }

  public portfolioDialog(data: any) {
    let dialogRef: MdDialogRef<PortfolioEventComponent>;

    dialogRef = this.dialog.open(PortfolioEventComponent);
    dialogRef.componentInstance.content = data;

    return dialogRef.afterClosed();
  }

  public feedbackDialog(data: any) {
    let dialogRef: MdDialogRef<FeedbackEventComponent>;

    dialogRef = this.dialog.open(FeedbackEventComponent);
    dialogRef.componentInstance.content = data;

    return dialogRef.afterClosed();
  }

  public declineFeedbackDialog(data: any) {
    let dialogRef: MdDialogRef<FeedbackDeclineComponent>;

    dialogRef = this.dialog.open(FeedbackDeclineComponent);
    dialogRef.componentInstance.content = data;

    return dialogRef.afterClosed();
  }
}
