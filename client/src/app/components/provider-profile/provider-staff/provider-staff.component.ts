import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MdDialog } from '@angular/material';

import { ConfirmDialogComponent } from '../../../shared/components/modals/confirm-dialog/confirm-dialog.component';
import { ProfileService } from '../../../shared/services/profile/profile.service';
import { AuthGroup } from '../../../shared/models/auth-group';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-provider-staff',
  templateUrl: './provider-staff.component.html',
  styleUrls: ['./provider-staff.component.scss']
})
export class ProviderStaffComponent extends AuthGroup implements OnInit, OnChanges {
  @Input() user: any = {};
  @Input() isOwner: boolean = false;
  @Input() isCanManage: boolean = false;

  formUploadMembers: FormGroup;
  formUpdateMembers = [];

  userId: number;
  userRole: any;
  isUserOwner: boolean = false;
  descriptionLimit = 100;

  membersList = [];
  membersListPager = [];
  amountMembersOnPage = 8;
  newMember = {
    photo_url: '',
    name: '',
    description: ''
  };
  isDisabledAddBtn = false;

  constructor(
    public dialog: MdDialog,
    private profileService: ProfileService,
    authService: AuthService,
    private fb: FormBuilder,) {
    super(authService);
  }

  ngOnInit() {
    this.initData(this.user);
    this.createFormGroup();
  }

  initData(user) {
    if (user) {
      this.userId = user.id;
      this.userRole = user.roleLowered;
      this.isUserOwner = this.isOwner;

      this.getMembers();
    }
  }

  createFormGroup() {
    this.formUploadMembers = this.fb.group({
      newMemberPhoto: [this.newMember.photo_url, Validators.required],
      newMemberName: [this.newMember.name, Validators.required],
      newMemberDescription: [this.newMember.description, Validators.required],
    });
  }

  createFormGroupsUpdate() {
    this.membersList.forEach((member, index) => {
      this.formUpdateMembers[index] = this.fb.group({
        memberPhoto: [member.photo_url, Validators.required],
        memberName: [member.name, Validators.required],
        memberDescription: [member.description, Validators.required],
      });
    });
  }

  ngOnChanges(changes: any) {
    if (changes.isCanManage) {
      this.isCanManage = changes.isCanManage.currentValue;
    }
  }

  getMembers() {
    this.profileService.getMembers(this.userId).subscribe(
      (resp) => {
        if (resp._body) {
          this.membersList = JSON.parse(resp._body);
          this.createFormGroupsUpdate();
        } else {
          this.membersList = [];
        }

        this.loadNextPage(true);
      }
    );
  }

  loadNextPage(isStart) {
    if (isStart) {
      this.membersListPager = [];
    }
    const startIndex = this.membersListPager.length;
    const endIndex = startIndex + this.amountMembersOnPage;
    this.membersListPager = this.membersListPager.concat(this.membersList.slice(startIndex, endIndex));
  }

  isLoadedPages() {
    return this.membersListPager.length < this.membersList.length;
  }

  editMembers(event) {
    this.profileService.editMembers(this.userId, this.userRole, event).subscribe(
      (resp) => {
        this.getMembers();
      }
    );
  }

  createMembers() {
    this.isDisabledAddBtn = true;
    this.profileService.createMembers(this.userId, this.newMember).subscribe(
      (resp) => {
        this.clearFormCreate();
        this.getMembers();
      }
    );
  }

  clearFormCreate() {
    this.newMember.photo_url = '';
    this.newMember.name = '';
    this.newMember.description = '';
    this.isDisabledAddBtn = false;
  }

  onSelectAvatar(avatar: File, member): void {
    if (avatar) {
      const file = avatar;
      const formData = new FormData();
      formData.append('file', file);
      this.uploadImg(formData, member);
    }
  }

  uploadImg(file, member) {
    this.profileService.uploadImages(file).subscribe(
      (resp) => {
        member.photo_url = resp.Location;
      }
    );
  }

  openDialog(event, photoId) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.infoText = 'Wollen Sie es löschen?';
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.msg) {
        this.removeMember(photoId);
      }
    });
  }

  removeMember(memberId) {
    this.profileService.removeMembers(this.userId, {memberId: memberId}).subscribe(
      (resp) => {
        this.getMembers();
      }
    );
  }
}
