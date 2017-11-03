import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditableInfoComponent } from '../../../shared/components/editable-info/editable-info.component';
import { EditablePopupComponent } from '../../../shared/components/editable-popup/editable-popup.component';
import { InfoDialogComponent } from '../../../shared/components/modals/info-dialog/info-dialog.component';
import { CreateReportProblemComponent } from '../../../shared/components/modals/create-report-problem/create-report-problem.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import { ProviderServicesService } from '../../../shared/services/provider-services/provider-services.service';
import { GeocodingService } from '../../../shared/services/geocoding/geocoding.service';
import { ProfileService } from '../../../shared/services/profile/profile.service';
import { PagerService } from '../../../shared/services/pager/pager.service';
import { AuthGroup } from '../../../shared/models/auth-group';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { RATING } from '../../../shared/constants';

@Component({
  selector: 'app-provider-info',
  templateUrl: './provider-info.component.html',
  styleUrls: ['./provider-info.component.scss']
})

export class ProviderInfoComponent extends AuthGroup implements OnInit, OnDestroy {
  @ViewChild('editable')
    editableInfoComponent: EditableInfoComponent;
  @Input()
    childeInput: string;
  @Input() house: string;
  @Input() feedCount: number;
  @Input() displayComponent: boolean;
  @Input() isOwner: boolean;

  @Output()
    setProviderData: EventEmitter<any> = new EventEmitter();

  loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('searchField') el: ElementRef;

  stateToggleValue = false;
  protected avatar: File;
  ratingLvl = RATING.length;
  userData: any;
  memberImg: any;
  userId: number;
  userRole: string;
  userPlan: string;
  searchLocation: any = {};
  newLocation: any = {};
  socialData = {};
  feedbacksList = [];
  documentsList = [];
  membersList = [];
  quotesList = [];
  displayingQuotesList = [];
  linkFlag = false;
  preLinkFlag = false;
  isNewLocation = false;
  linkRange: any = [];
  searchResults = [];
  filteredServices = [];
  daysList = [
    {
      name: 'Mon',
      title: 'Montag',
      timeFrom: '',
      timeTo: '',
      is_show: false
    }, {
      name: 'Tue',
      title: 'Dienstag',
      timeFrom: '',
      timeTo: '',
      is_show: false
    }, {
      name: 'Wed',
      title: 'Mittwotch',
      timeFrom: '',
      timeTo: '',
      is_show: false
    }, {
      name: 'Thu',
      title: 'Donnerstag',
      timeFrom: '',
      timeTo: '',
      is_show: false
    }, {
      name: 'Fri',
      title: 'Freitag',
      timeFrom: '',
      timeTo: '',
      is_show: false
    }, {
      name: 'Sut',
      title: 'Samstag',
      timeFrom: '',
      timeTo: '',
      is_show: false
    }, {
      name: 'Sun',
      title: 'Sonntag',
      timeFrom: '',
      timeTo: '',
      is_show: false
    }
  ];
  currentUserData: any = {};
  currentRater = {};
  providerData: any = {};
  contactPersone: any = {};
  emergencyNumber: any = {};
  services = [];
  service: any;
  hours = [];
  emptyMsg: string;
  markers = [];
  contactInformation = [];
  editMode: boolean = false;
  docUpload: any;
  subRouterParamsChange: any;

  cities = [];
  cityCtrl: FormControl;
  newCityCtrl: FormControl;
  locationEdit: any;
  filteredCities: any;
  filteredCities2: any;
  isSearchingLocation = false;

  // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: number;
  lng: number;

  stepThreeForm: FormGroup;
  form2: FormGroup;
  form: FormGroup;

  currentRole = {
    Rater: () => {
      this.isRater = true;
    },
    Provider: () => {
      this.userId = this.currentUserData.user.id;
      this.userRole = this.currentUserData.user.role.toLowerCase();
      if (this.userId === this.currentUser.user.id) {
        this.isProvider = true;
      }
    },
    Unregister: () => {
      this.isUnregister = true;
    },
  };

  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private pagerService: PagerService,
    private geocodingService: GeocodingService,
    private providerServicesService: ProviderServicesService,
    public dialog: MdDialog,
    authService: AuthService
  ) {
    super(authService);
  }

  stateToggle() {
    this.stateToggleValue = !this.stateToggleValue;
  }

  ngOnInit() {
    this.displayComponent = true;
    this.socialData = {
      link: 'https://angular.io/',
      title: 'angular',
      name: 'google-plus'
    };

    this.form2 = this.fb.group({
      range: [ [ 1, 1 ] ],
      tooltips: true,
      disabled: true,
      checked: false,
      link: false,
      companyName : '',
      category: '',
      title: '',
      description: '',
      rating: 0,
      imagesUpload: []
    });

    this.subRouterParamsChange = this.route.params.subscribe(params => {
      if (params && this.currentUser && this.currentUser.user
          && params.id === this.currentUser.user.id) {

        this.isProvider = true;
      } else {
        this.isProvider = false;
      }
      this.getCurrentUser();
    });

    this.geocodingService.getJSON().subscribe(
      (data) => setTimeout(() => {
        for (const prop in data) {
          this.cities.push(data[prop] + ', ' + prop);
        }
      }, 0)
    );

    this.cityCtrl = new FormControl();
    this.filteredCities = this.cityCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterCities(name));
    this.newCityCtrl = new FormControl();
    this.filteredCities2 = this.newCityCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterCities(name));
  }

  ngOnDestroy() {
    if (this.subRouterParamsChange) {
      this.subRouterParamsChange.unsubscribe();
    }
  }

  getCurrentUser() {
    if (this.router.url === '/provider-profile') {
      this.currentUserData = this.currentUser;
      this.getCurrentUserData();
    } else {
      this.userId = this.route.snapshot.params['id'];
      this.getUser();
    }
  }

  getVisitorRole() {
    if (this.currentUser.user && this.currentUser.user.role !== 'Admin') {
      this.currentRole[this.currentUser.user.role]();
    } else if (this.currentUser.user && this.currentUser.user.role) {
      this.currentRole['Unregister']();
    }
  }

  getCurrentUserData() {
    this.getVisitorRole();
    this.userPlan = this.currentUser.user && this.currentUser.user.stripe_subscription ? this.currentUser.user.stripe_subscription.plan.name : '';
    if (this.currentUserData) {
      this.getUserRoleData();
      this.getFeedbacks();
      this.getDocuments();
      this.getMembers();
    }
  }

  getUser() {
    this.profileService.getUser(this.userId).subscribe(
      (resp) => {
        if (JSON.parse(resp._body)) {
          this.currentUserData = {user: JSON.parse(resp._body)};
          this.userRole = this.currentUserData.user.role.toLowerCase();
          this.getCurrentUserData();
        }
      }
    );
  }


  getUserRoleData() {
    this.profileService.getUserRoleData(this.userId, this.userRole).subscribe(
      (resp) => {
        if (resp) {

          this.providerData = JSON.parse(resp._body);
          this.contactInformation = this.providerData.contact_information || {};
          this.emergencyNumber = this.providerData.contact_information.emergency_number || {};
          this.contactPersone = this.providerData.contact_person_info || {};

          let locationsCollection = this.providerData.Locations;
          if (locationsCollection.length) {
            this.providerData.city = locationsCollection[0].city;
            this.providerData.house_number = locationsCollection[0].house_number;
            this.providerData.street = locationsCollection[0].street;
            this.providerData.zip_code = locationsCollection[0].zip_code;
          }
          this.fillMarkers(locationsCollection);

          for (let key in this.providerData.hours_of_operation) {
            this.hours.push(key);
          }
        }
      }
    );
  }

  getFeedbacks() {
    this.quotesList = [];
    this.profileService.getFeedback(this.userId, this.userRole).subscribe(
      (resp) => {
        if (resp._body) {
          this.feedbacksList = JSON.parse(resp._body);
          for (let i = 0; i < this.feedbacksList.length; i++) {
            let obj = this.feedbacksList[i];
            if (obj.Rater != null) {
              const rater = obj.Rater;

              if (obj.is_approved && obj.is_displaying) {
                // fill quotes list from feedback
                this.quotesList.push({
                  id: obj.id,
                  text: obj.quoted_job_description,
                  rater_id: obj.rater_id,
                  is_displaying_quote: obj.is_displaying_quote,
                  photo_url: rater.photo_url,
                  first_name: rater.first_name,
                  last_name: rater.last_name,
                  user_id : rater.user_id,
                  role: 'rater'
                });
              }

              // fill rater info in feedback
              obj.rating = ((obj.quality_of_friendliness + obj.quality_of_price + obj.quality_of_timeschedule + obj.quality_of_work) / 4);
              obj.rater_photo_url = rater.photo_url;
              obj.rater_first_name = rater.first_name;
              obj.rater_last_name = rater.last_name;
              obj.rater_id = rater.id;
              obj.role = 'rater';

              this.profileService.getFeedback(rater.user_id, 'rater').subscribe(
                (response) => {
                  if (response._body) {
                    const ratersFeedbacks = JSON.parse(response._body);
                    obj.raters_feedbacks = ratersFeedbacks.length;
                  }
                }
              );

            }
          }
          this.setProviderData.emit(this.feedbacksList.length);

          // this.fillQuotesList();
          this.filterDisplayingQuotesList();
          // this.fillFeedbacksList();
          this.getServices();
          // set items to json response
          this.allItems = this.feedbacksList;

          // initialize to page 1
          this.setPage(1);
        } else {
          this.emptyMsg = 'No feedbacks';
        }
      }
    );
  }

  fillMarkers(markersCollection) {
    this.markers = [];
    for (let i = 0; i < markersCollection.length; i++) {
      let marker = markersCollection[i].location_coordinates;
      this.markers.push({
        lat: marker.lat,
        lng: marker.lng
      });
    }
  }

  fillQuotesList() {
    for (let i = 0; i < this.quotesList.length; i++) {
      let obj = this.quotesList[i];
      if (obj.rater_id) {
        this.profileService.getUserRoleData(obj.rater_id, 'rater').subscribe(
          (resp) => {
            if (resp._body) {
              let rater = JSON.parse(resp._body);
              obj.photo_url = rater.photo_url;
              obj.first_name = rater.first_name;
              obj.last_name = rater.last_name;
              obj.user_id = rater.user_id;
              obj.role = 'rater';
            }
          }
        );
      }
    }
  }

  filterDisplayingQuotesList() {
    this.displayingQuotesList = [];
    for (let i = 0; i < this.quotesList.length; i++) {
      let obj = this.quotesList[i];
      if (obj.is_displaying_quote) {
        this.displayingQuotesList.push(obj);
      }
    }
  }

  selectingFeedbacks(event, serviceId) {
    if (event.value === '0') {
      this.getFeedbacks();
    }
    this.allItems = this.feedbacksList.filter(function(feedback) {
      return feedback.service_id === +event.value;
    });
    this.setPage(1);
  }

  fillFeedbacksList() {
    for (let i = 0; i < this.feedbacksList.length; i++) {
      const obj = this.feedbacksList[i];
      obj.rating = ((obj.quality_of_friendliness + obj.quality_of_price + obj.quality_of_timeschedule + obj.quality_of_work) / 4);

      if (obj.Rater != null) {
        const rater = obj.Rater;

        obj.rater_photo_url = rater.photo_url;
        obj.rater_first_name = rater.first_name;
        obj.rater_last_name = rater.last_name;
        obj.rater_id = rater.id;
        obj.role = 'rater';

        this.profileService.getFeedback(obj.rater_id, 'rater').subscribe(
          (response) => {
            if (response._body) {
              const ratersFeedbacks = JSON.parse(response._body);
              obj.raters_feedbacks = ratersFeedbacks.length;
            }
          }
        );
      }
    }
  }

  getDocuments() {
    this.profileService.getDocuments(this.userId, this.userRole).subscribe(
      (resp: any) => {
        if (resp._body) {
          this.documentsList = JSON.parse(resp._body);
        }
      }
    );
  }
  getMembers() {
    this.profileService.getMembers(this.userId).subscribe(
      (resp) => {
        if (resp._body) {
          this.membersList = JSON.parse(resp._body);
        }
      }
    );
  }

  getServices() {
    this.providerServicesService.getServices().subscribe(
      (resp) => {
        this.services = resp;
        for (let i = 0; i < this.feedbacksList.length; i++) {
          for (let j = 0; j < this.services.length; j++) {
            const obj = this.feedbacksList[i];
            const service = this.services[j];
            if (obj.service_id === service.id) {
              obj.service_name = service.name;
            }
          }
        }
      }
    );
  }

  onSaveEvent(val, field) {
    if (field) {
      let editData = {[field]: val};
      this.profileService.editUser(this.userId, this.userRole, editData).subscribe(
        (resp) => {
          this.getCurrentUserData();
        }
      );
    } else {
      this.getCurrentUserData();
    }
  }

  readUrl(event): void {
    if (event.target.files && event.srcElement.files[0]) {
      const files = event.srcElement.files;
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.profileService.uploadFile(formData).subscribe(
        (resp) => {
          this.docUpload = {
            description: resp.Key,
            file_url: resp.Location,
            name: resp.key
          };
        }
      );
    }
  }

  upload() {
    this.profileService.uploadDocuments(this.userId, this.userRole, this.docUpload).subscribe(
      (resp) => {
        this.getDocuments();
      }
    );
  }

  deleteDocument(documentId) {
    this.profileService.removeDocument(this.userId, this.userRole, documentId).subscribe(
      (resp) => {
        this.getDocuments();
      }
    );
  }

  writeFeedback() {
    this.router.navigate(['feedback'], {queryParams: {providerId: this.userId}});
  }

  reportFeedback(event) {
    const dialogRef = this.dialog.open(CreateReportProblemComponent);
    dialogRef.componentInstance.content = event;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editComment(event) {
    let tempCollection = event.comments;
    if (event.val === 'remove') {
      tempCollection = event.comments.splice(event.commentId, 1);
    }
    for (let i = 0; i < event.comments.length; i++) {
      let obj = event.comments[i];
      if (obj.id === event.commentId) {
        obj = event.val;
      }
    }
    this.profileService.editFeedback(this.userId, this.userRole, event.feedId, {replies: event.comments}).subscribe(
      (resp) => {
        this.getFeedbacks();
      }
    );
  }

  editMembers(event, field) {
    event.photo_url = this.contactPersone.photo_url;
    this.onSaveEvent(event, field);
  }

  saveEmergencyNumber(event, field) {
    const numberobj = {emergency_number: event};
    this.onSaveEvent(numberobj, field);
  }

  onSelectAvatar(avatar: File): void {
    if (avatar) {
      const file = avatar;
      const formData = new FormData();
      formData.append('file', file);
      this.uploadImg(formData);
    }
    this.avatar = avatar;
  }

  uploadImg(file) {
    this.profileService.uploadImages(file).subscribe(
      (resp) => {
        this.contactPersone.photo_url = resp.Location;
      }
    );
  }

  onChanges(event, day, i, form) {
    if (this.preLinkFlag && event) {
      this.linkFlag = this.preLinkFlag;
      this.linkRange = event;
    } else {
      this.linkFlag = false;
    }
    if (this.daysList[i].is_show && event) {
      this.daysList[i].timeFrom = '' + event[0] + '-00';
      this.daysList[i].timeTo = '' + event[1] + '-00';
    }
  }

  onSubmit(event) {
    const tempCollection = this.daysList.filter(function(item){
      return item.timeTo.length;
    });
    this.onSaveEvent(tempCollection, 'hours_of_operation');
  }

  updateCheckedOptions(event, index, form) {
    if (event.checked === false) {
      this.daysList[index].timeFrom = '';
      this.daysList[index].timeTo = '';
    }
  }
  updateFlagOptions(event) {
    if (event.checked === false) {
      this.linkFlag = false;
      this.linkRange = [0, 0];
    }
  }

  onKeyup(event, model) {
    this.searchLocation = model;
  }

  getLocation(city, type) {
    this.geocodingService.search(city, 'city').subscribe(
      (resp) => {
        if (resp[0] && resp[0].location) {
          this.fillLocationModel(resp, type);
        } else {
          this.openInfoDialog();
          this.newCityCtrl.reset();
        }
      }
    );
  }

  fillLocationModel(location, type) {
    this.searchLocation.location_coordinates = location[0].location;
    this.searchLocation.city = location[0].city.substring(location[0].city.indexOf(','), 0);
    this.searchLocation.zip_code = location[0].city.substring(location[0].city.indexOf(',') + 2, location[0].city.length);
  }

  filterCities(val: string) {
    if (val != null && val.length > 2) {
      return val ? this.cities.filter(s => new RegExp(`${val}`, 'gi').test(s))
        : this.cities;
    }
  }

  filteringLocations(location) {
    if (this.isNewLocation) {
      this.addLocations();
    }
    if (this.editMode) {
      this.editLocations();
    }
  }

  editLocations() {
    this.profileService.editLocations(this.userId, this.locationEdit, this.locationEdit.id).subscribe(
      (resp) => {
        this.resetLocationForm();
      }
    );
  }

  removeLocations(location) {
    this.profileService.removeLocations(this.userId, location.id).subscribe(
      (resp) => {
        this.resetLocationForm();
      }
    );
  }

  addLocations() {
    this.newLocation = this.searchLocation;
    this.profileService.addLocations(this.userId, this.searchLocation, this.profileService.getToken()).subscribe(
      (resp) => {
        this.resetLocationForm();
      }
    );
  }

  resetLocationForm() {
    this.editMode = false;
    this.isNewLocation = false;
    this.searchLocation = {};
    this.newCityCtrl.reset();
    this.cityCtrl.reset();
    this.getCurrentUserData();
  }

  locateUser(index) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this, index));
    }
  }

  setPosition(index, position) {
    this.geocodingService.reverseSearch(position.coords.latitude + ',' + position.coords.longitude).subscribe(
      (resp) => {
        const geoData = {
          city: resp[0].city,
          location_coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        };
        if (typeof index === 'number') {
          this.providerData.Locations[index] = geoData;
        } else {
          this.providerData.Locations.push(geoData);
        }
      }
    );
  }

  editLocation(location) {
    this.editMode = !this.editMode;
    this.isNewLocation = false;
    this.locationEdit = location;
  }

  edit() {
    this.editMode = !this.editMode;
  }

  cancel() {
    this.editMode = !this.editMode;
  }

  cancelAddLocation() {
    this.isNewLocation = !this.isNewLocation;
  }

  addLocation() {
    this.isNewLocation = true;
    this.editMode = false;
  }

  setPage(page: number) {
    if (page < 1) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditablePopupComponent);
    dialogRef.componentInstance.list = this.quotesList;
    dialogRef.componentInstance.displayList = this.displayingQuotesList;
    dialogRef.componentInstance.userId = this.userId;
    dialogRef.componentInstance.userRole = this.userRole;
    dialogRef.afterClosed().subscribe(result => {
      if (result.msg && result.msg === 'update') {
        this.displayingQuotesList = result.displayList;
      }
    });
  }

  openInfoDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Es gibt keine Geodaten bei diesem Standort';
  }

  isShowHoursOfOperation(hours) {
    if (this.isOwner) { return true; }

    if (hours && hours.length) {
      for (let key in hours) {
        if (hours[key].is_show) {
          return true;
        }
      }
    }

    return false;
  }

  getRaterName(firstName, lastName) {
    let name = '';
    name += firstName ? firstName + ' ' : '';
    name += lastName ? lastName : '';

    return name;
  }

}
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
