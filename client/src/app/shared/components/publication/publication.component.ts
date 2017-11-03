import {Component, HostBinding, OnChanges, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnChanges, OnDestroy {

  isEditFeed = false;
  isNewComment = false;
  newComment = {
    date: null,
    message: ''
  };
  ellipsisClass = 'publication__ellipsis';
  @HostBinding('class.publication') 1;
  @Input() id: number;
  @Input() creatorId: number;
  @Input() creatorRole: string;
  @Input() isDisplayStatus: boolean;
  @Input() isDisplaying: boolean;
  @Input() isApproved: any;
  @Input() conditionComment: boolean = false;
  @Input() conditionEdit: boolean = false;
  @Input() avatarUrl: string;
  @Input() avatarCaption: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() date: string;
  @Input() body: string;
  @Input() serviceName: string;
  @Input() items: string[];
  @Input() socialData: Object;
  @Input() likes: number;
  @Input() ratersFeedbacks: number;
  @Input() comments = [];
  @Input() isCanComplain: boolean = false;
  @Input() ownerRating: void;
  @Input() isReadOnly: boolean;
  @Output() editEvent: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() reportEvent: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnChanges() {
    this.socialData = {
      name: '',
      link: '',
      title: this.title,
      text: this.body,
      creatorId: this.creatorId,
      creatorRole: this.creatorRole
    };
  }

  ngOnDestroy() {
    this.comments = [];
  }

  editComment(event, commentId, id) {
    if (event !== 'remove') {
      event.date = new Date();
    }
    this.editEvent.emit({val: event, comments: this.comments, commentId: commentId, feedId: id});
  }

  saveEditFeed() {
    const editData = {
      job_description: this.body,
      job_title: this.title
    };
    this.editEvent.emit({val: editData, feedId: this.id});
  }

  editFeed() {
    this.isEditFeed = true;
  }

  removeFeed() {
    this.isEditFeed = false;
    this.editEvent.emit({feedRemove: true, feedId: this.id});
  }

  reportFeed() {
    this.isEditFeed = false;
    this.reportEvent.emit({feedId: this.id});
  }

  goToCreator() {
    if (this.creatorId) {
      this.router.navigate([this.creatorRole + '-profile/' + this.creatorId]);
    }
  }

  openFields() {
    this.isNewComment = true;
  }

  save() {
    this.newComment.date = new Date();
    this.comments.push(this.newComment);
    this.isEditFeed = false;
    this.isNewComment = false;
    this.editEvent.emit({feedId: this.id, comments: this.comments});
  }

  cancel() {
    this.isEditFeed = false;
  }
}
