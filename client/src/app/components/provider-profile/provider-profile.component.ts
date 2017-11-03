import { Component, OnInit, OnDestroy } from '@angular/core';
import { RATING } from '../../shared/constants';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../shared/services/profile/profile.service';

import { DialogService } from '../../shared/services/dialog/dialog.service';

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.scss']
})
export class ProviderProfileComponent implements OnInit, OnDestroy {
  user = null;
  visitor = null;
  isOwner = false;
  isUnregister = false;

  limits = {
    inspiration: 0,
    inspirationAvailable: null,
    photosSimple: 0,
    photosSimpleAvailable: 0,
    photosBeforeAfter: 0,
    photosBeforeAfterAvailable: 0,
    isCanManageMembers: false
  };

  subRouterParamsChange: any;

  providerData: any = {};
  ratingLvl = RATING.length;
  isSelfRegistered: boolean;
  isActiveTab: boolean;
  isMembersTab: boolean = false;
  isPortfolioTab: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.subRouterParamsChange = this.route.params.subscribe(params => {
      if (params && params.id) {
        this.getUser(params.id);
      } else {
        this.getUserVisitor();
      }
    });
  }

  ngOnDestroy() {
    if (this.subRouterParamsChange) {
      this.subRouterParamsChange.unsubscribe();
    }
  }

  getUser(userId) {
    this.profileService.getUser(userId).subscribe(
      (resp) => {
        if (JSON.parse(resp._body)) {
          this.user = JSON.parse(resp._body);
          this.getUserVisitor();
        }
      }
    );
  }

  getUserVisitor() {
    const currentUser = localStorage.getItem('currentUser');
    this.visitor = currentUser ? JSON.parse(currentUser).user : false;

    this.checkIsOwner();
  }

  checkIsOwner() {
    // if no visitor then it's Unregistered user
    if (!this.visitor) {
      this.isUnregister = true;
    }

    // if no User then it's own profile
    if (this.user === null) {
      this.user = this.visitor;
      this.isOwner = true;
    }

    // if ids are identical then it's Own profile
    if (!this.isUnregister &&
      this.visitor.id === this.user.id) {

      this.isOwner = true;
    }

    this.user.roleLowered = this.user.role.toLowerCase();

    if (this.visitor) {
      this.visitor.roleLowered = this.visitor.role.toLowerCase();
    }

    this.setComponentData();
  }

  setComponentData() {
    this.isSelfRegistered = this.user.is_self_registered;
    this.getProviderData();

    if (this.isOwner) {
      this.getLimitsUser();
    }
  }

  getProviderData(feedbacks?) {
    if (!this.user) { return; }

    this.profileService.getUserRoleData(this.user.id, this.user.roleLowered).subscribe(
      (resp) => {
        if (resp) {
          this.providerData = JSON.parse(resp._body);
          const locationsCollection = this.providerData.Locations;
          if (locationsCollection.length) {
            this.providerData.city = locationsCollection[0].city;
            this.providerData.house_number = locationsCollection[0].house_number;
            this.providerData.street = locationsCollection[0].street;
          }
          this.providerData.last_online = this.user.last_online;
          this.providerData.feedCount = feedbacks;
          if (this.providerData.feedCount === undefined) {
            this.providerData.feedCount = 0;
          }
          this.providerData.last_online = this.user.last_online;
        }
      }
    );
  }

  getLimitsUser() {
    this.profileService.getUsersPlansLimit(this.user.id).subscribe(
      (resp) => {
        if (resp.photos_inspiration_page_limit) {
          this.limits.inspiration = resp.photos_inspiration_page_limit;
        }
        if (resp.photos_simple_limit) {
          this.limits.photosSimple = resp.photos_simple_limit;
        }
        if (resp.photos_before_after_limit) {
          this.limits.photosBeforeAfter = resp.photos_before_after_limit;
        }
        if (resp.staff_members_enabled) {
          this.limits.isCanManageMembers = resp.staff_members_enabled;
        }
      }
    );
  }

  openPopup() {
    this.dialogService.fillProviderData(this.providerData);
  }

  onSelectChange($event: any) {
    this.isActiveTab = true;
    this.isMembersTab = $event.tab.textLabel === 'Mitarbeiter';
    this.isPortfolioTab = $event.tab.textLabel === 'Referenzbilder';
  }
}
