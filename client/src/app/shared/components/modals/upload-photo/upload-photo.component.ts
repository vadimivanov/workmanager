import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { MdDialogRef } from '@angular/material';
import {
  FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { ProviderServicesService } from 'app/shared/services/provider-services/provider-services.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent implements OnInit {
  formUploadPhotos: FormGroup;

  content: any;

  currentCategory: string;
  dialogTemplate: string = '';
  isEditModel = false;
  isAddNewPhoto: boolean = true;

  imageModel = {
    id: null,
    description: '',
    service_id: null,
    is_visible: true,
    is_idea_for_inspiration: false,
    photo_simple_url: null,
    photo_before_url: null,
    photo_after_url: null
  };
  categoriesList = [];
  photoModel: any;
  isSendedPhoto: boolean;
  service: any;

  photosSimple: any;
  photosSimpleAvailable: any;
  photosSimpleVisibleAvailable: any;

  photosBeforeAfter: any;
  photosBeforeAfterAvailable: any;
  photosBeforeAfterVisibleAvailable: any;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    public dialogRef: MdDialogRef<UploadPhotoComponent>,
    private providerServicesService: ProviderServicesService
  ) {}

  ngOnInit() {
    this.isSendedPhoto = false;
    this.isEditModel = !!this.content.photoModel;

    this.categoriesList = this.content.categoriesList.slice();

    this.imageModel = {
      id: this.content.photoModel ? this.content.photoModel.id : null,
      description: this.content.photoModel ? this.content.photoModel.description : '',
      service_id: this.content.photoModel ? this.content.photoModel.service_id : null,
      is_visible: this.content.photoModel ? this.content.photoModel.is_visible : true,
      is_idea_for_inspiration: this.content.photoModel ? this.content.photoModel.is_idea_for_inspiration : false,
      photo_simple_url: this.content.photoModel ? this.content.photoModel.photo_simple_url : null,
      photo_before_url: this.content.photoModel ? this.content.photoModel.photo_before_url : null,
      photo_after_url: this.content.photoModel ? this.content.photoModel.photo_after_url : null
    };

    this.manageSelectedService();

    this.photosSimple = this.content.limits.photosSimple;
    this.photosSimpleAvailable = this.content.limits.photosSimpleAvailable;
    this.photosSimpleVisibleAvailable = this.content.limits.photosSimpleVisibleAvailable;

    this.photosBeforeAfter = this.content.limits.photosBeforeAfter;
    this.photosBeforeAfterAvailable = this.content.limits.photosBeforeAfterAvailable;
    this.photosBeforeAfterVisibleAvailable = this.content.limits.photosBeforeAfterVisibleAvailable;

    if (this.content.photoModel && this.content.photoModel.photo_before_url) {
      this.toUploadPhoto(null, 'before-after', true);
    }
    if (this.content.photoModel && this.content.photoModel.photo_simple_url) {
      this.toUploadPhoto(null, 'single', true);
    }
  }

  manageSelectedService() {
    if (this.imageModel.service_id) {
      const isSelectedCategoryInList = this.categoriesList.some((item) => {
        return item.id === this.imageModel.service_id;
      });

      if (!isSelectedCategoryInList) {
        this.providerServicesService.getService(this.imageModel.service_id).subscribe(
          (resp) => {
            this.categoriesList.push(resp);
          }
        );
      }
    }
  }

  createFormGroup(direct, isEditVisible) {
    const opt = {
      service_id: [this.imageModel.service_id, Validators.required],
      description: [this.imageModel.description, Validators.required],
    };

    if (direct === 'single') {
      opt['photo_simple_url'] = [this.imageModel['photo_simple_url'], Validators.required];
    } else {
      opt['photo_before_url'] = [this.imageModel['photo_before_url'], Validators.required];
      opt['photo_after_url'] = [this.imageModel['photo_after_url'], Validators.required];
    }

    if (isEditVisible) {
      opt['isVisible'] = [this.imageModel['is_visible'], Validators.nullValidator];
    }

    this.formUploadPhotos = this.fb.group(opt);
  }

  toUploadPhoto(event, direct, isCannotEditPhoto) {
    if ( isCannotEditPhoto ||
         (direct === 'single' && this.photosSimpleAvailable) ||
         (direct === 'before-after' && this.photosBeforeAfterAvailable)) {

      this.dialogTemplate = direct;
      this.isAddNewPhoto = !isCannotEditPhoto;

      this.createFormGroup(direct, !this.isAddNewPhoto);
    }
  }

  deletePhoto(type) {
    this.imageModel[type] = null;
  }

  readUrl(event, type) {
    if (event.target.files && event.srcElement.files[0]) {
      const files = event.srcElement.files;
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      event.target.value = '';
      this.upload(formData, type);
    }
  }

  upload(file, type) {
    this.profileService.uploadImages(file).subscribe(
      (resp) => {
        this.imageModel[type] = resp.Location;
      }
    );
  }

  onSubmit(value: any) {
    if (this.formUploadPhotos.valid && !this.isSendedPhoto) {
      this.isSendedPhoto = true;
      this.isEditModel ? this.updatePortfolio() : this.setToPortfolio();
    }
  }

  setToPortfolio() {
    this.profileService.setToPortfolio(this.content.userId, this.content.userRole, this.imageModel).subscribe(
      (resp) => {
        this.dialogRef.close({msg: 'confirm'});
      }
    );
  }

  updatePortfolio() {
    if (!this.imageModel.is_visible) {
      this.imageModel.is_idea_for_inspiration = false;
    }

    this.profileService.updatePortfolio(this.content.userId, this.content.userRole, this.imageModel).subscribe(
      (resp) => {
        this.dialogRef.close({msg: 'confirm'});
      }
    );
  }
}
