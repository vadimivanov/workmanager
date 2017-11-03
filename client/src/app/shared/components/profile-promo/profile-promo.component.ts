import { Component, HostBinding, Input, OnInit, ViewChild, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-promo',
  templateUrl: './profile-promo.component.html',
  styleUrls: ['./profile-promo.component.scss']
})
export class ProfilePromoComponent implements OnInit, OnChanges {
  @HostBinding('class.profile-promo') 1;
  @ViewChild('blur') blurEl;
  @Input() avatarUrl: string;
  @Input() title: string;
  @Input() status: string;
  @Input() rating: string;
  @Input() feedCount: number;
  @Input() house: string;
  @Input() street: string;
  @Input() city: string;
  @Input() bg: string;
  @Input() isSelfRegistered: boolean;
  @Output() initPopup: EventEmitter<any> = new EventEmitter();

  @Input() isCanManageMembers: boolean = false;
  @Input() isMembersTab: boolean = false;
  @Input() isOwnerUser: boolean = false;

  ngOnInit() {
    this.blurEl.nativeElement.style['background-image'] = `url(${this.bg})`;
  }

  ngOnChanges(changes: any) {
    if (changes.isCanManageMembers) {
      this.isCanManageMembers = changes.isCanManageMembers.currentValue;
    }
    if (changes.isMembersTab) {
      this.isMembersTab = changes.isMembersTab.currentValue;
    }
    if (changes.isOwnerUser) {
      this.isOwnerUser = changes.isOwnerUser.currentValue;
    }
  }

  openPopup() {
    this.initPopup.emit();
  }
}
