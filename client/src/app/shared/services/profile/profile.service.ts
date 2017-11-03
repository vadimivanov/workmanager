import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import config from '../../../shared/config';
import { NetworkService } from '../network/network.service';
import { Visit } from '../../models/visit.model';

@Injectable()
export class ProfileService {
  private usersUrl: string = config.apiUrl + 'api/v1/users';
  private userUrl: string = config.apiUrl + 'api/v1/users';
  private uploadImageUrl: string = config.apiUrl + 'api/v1/uploads/images';
  private sendEmailUrl: string = config.apiUrl + 'api/v1/contact-us';
  private billingPlansUrl: string = config.apiUrl + 'api/v1/billing/plans';
  private billingUrl: string = config.apiUrl + 'api/v1/users/billing';
  private authToken: string;
  public registeredUser: Subject<any> = new Subject<any>();
  public subject = new Subject<any>();

  constructor(private http: NetworkService) {
    this.authToken = '';
  }

  getToken() {
    this.authToken = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).JWT : '';
    return this.authToken;
  }

  getStatistics(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.usersUrl + '/' + id + '/provider/visits',
      {headers: headers}
    ).map((response: Response) => {
      return (<any>response.json()).map((item => {
        return new Visit({
          id: item.id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          location_coordinates: item.location_coordinates,
          provider_id: item.provider_id,
          service: item.service
        });
      }))
    }).catch(this.handleErrors);
  }

  emailConfirmation(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.usersUrl + '/' + id + '/request-email-confirmation',
      {headers: headers}
    ).map((response: Response) => {
      return (<any>response.json())
    }).catch(this.handleErrors);
  }

  getUsers() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.usersUrl,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  forgotPassword(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.usersUrl + '/' + id + '/forgot-password',
      {headers: headers}
    ).catch(this.handleErrors);
  }

  getBillingPlans() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.billingPlansUrl,
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  changeBillingPlan(id, planId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.usersUrl + '/' + id + '/subscription',
      JSON.stringify({
        plan_id: planId
      }),
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  getUsersPlansLimit(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.usersUrl + '/' + id + '/plan-limit',
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  changeNotificationSettings(id, data, token) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', token);

    return this.http.put(
      this.userUrl + '/' + id + '/notification-settings-list',
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  addLocations(id, data, token) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', token);

    return this.http.post(
      this.usersUrl + '/' + id + '/provider/locations',
      data,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  editLocations(id, data, locationId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.usersUrl + '/' + id + '/provider/locations/' + locationId,
      data,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  removeLocations(id, locationId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.delete(
      this.usersUrl + '/' + id + '/provider/locations/' + locationId,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  checkBillingCard(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.get(
      this.userUrl + '/' + id + '/billing-card',
      {headers: headers}
    ).catch(this.handleErrors);
  }

  getUserByEmail(email: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.userUrl + '?' + `email=${email}`,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  resetPassword(id, jwt, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', jwt);

    return this.http.put(
      this.usersUrl + '/' + id,
      JSON.stringify({
        password: password
      }),
      {headers: headers}
    ).catch(this.handleErrors);
  }

  getUser(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.userUrl + '/' + id,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  getUserRoleData(id, role) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.userUrl + '/' + id + '/' + role,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  editUser(id, role, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.userUrl + '/' + id + '/' + role,
      data,
      {headers: headers}
    ).catch(this.handleErrors);

  }

  getUpdatedUser(): Observable<any> {
    return this.subject.asObservable();
  }

  getFeedbackRequests(id, role) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.get(
      this.userUrl + '/' + id + '/' + role + '/feedback-requests',
      {headers: headers}
    ).catch(this.handleErrors);
  }

  removeFeedbackRequest(id, role, feedId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.delete(
      this.userUrl + '/' + id + '/' + role + '/feedback-requests/' + feedId,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  getFeedback(id, role) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.get(
      this.userUrl + '/' + id + '/' + role + '/feedbacks',
      {headers: headers}
    ).catch(this.handleErrors);
  }

  editFeedback(id, role, feedId, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.userUrl + '/' + id + '/' + role + '/feedbacks' + '/' + feedId,
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  removeFeedback(id, role, feedId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.delete(
      this.userUrl + '/' + id + '/' + role + '/feedbacks' + '/' + feedId,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  reportFeedback(id, feedId, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.userUrl + '/' + id + '/problem-feedback-reports',
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  getDocuments(id, role) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.userUrl + '/' + id + '/' + role + '/documents',
      {headers: headers}
    ).catch(this.handleErrors);
  }

  uploadDocuments(id, role, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.userUrl + '/' + id + '/' + role + '/documents',
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  removeDocument(id, role, documentId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.delete(
      this.userUrl + '/' + id + '/' + role + '/documents' + '/' + documentId,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  getMembers(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.userUrl + '/' + id + '/provider/staff-members',
      {headers: headers}
    ).catch(this.handleErrors);
  }

  createMembers(id, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.userUrl + '/' + id + '/provider/staff-members',
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  editMembers(id, role, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.userUrl + '/' + id + '/provider/staff-members' + '/' + data.id,
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  removeMembers(id, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.delete(
      this.userUrl + '/' + id + '/provider/staff-members' + '/' + data.memberId,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  sendEmail(email, name, text) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post(
      this.sendEmailUrl,
      JSON.stringify({
        email: email,
        name: name,
        text: text
      }),
      {headers: headers}
    ).catch(this.handleErrors);
  }

  saveImage(img: File) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.uploadImageUrl,
      img,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  sendFeedback(id, role, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.userUrl + '/' + id + '/' + role + '/feedbacks',
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  sendFeedbackRequest(id, role, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.userUrl + '/' + id + '/' + role + '/feedback-requests',
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  sendFeedbackRequestEmail(id, role, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.userUrl + '/' + id + '/' + role + '/request-feedback-by-email',
      data,
      {headers: headers}
    ).catch(this.handleErrors);
  }

  uploadImages(file): any {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post(
      config.apiUrl + 'api/v1/uploads/images',
      file,
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  uploadFile(file): any {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      config.apiUrl + 'api/v1/uploads/files',
      file,
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  // user service
  getRegisteredUser(): any {
    let registeredUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let registeredUserRole = registeredUser.user.role.toLowerCase();

    return this.getUserRoleData(registeredUser.user.id, registeredUserRole).subscribe(
      (resp) => {
        this.registeredUser.next(Object.assign(registeredUser, JSON.parse(resp._body)));
      },
      (error) => console.log('error----getUserRoleData', error)
    );
  }

  getSubServices(id, role): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.userUrl + '/' + id + '/provider/subservices',
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  getPortfolio(id, role): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.get(
      this.userUrl + '/' + id + '/provider/portfolio-photos',
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  setToPortfolio(id, role, data): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.userUrl + '/' + id + '/provider/portfolio-photos',
      data,
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  updatePortfolio(id, role, data): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.userUrl + '/' + id + '/provider/portfolio-photos' + '/' + data.id,
      data,
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  deletePhoto(id, role, data): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.delete(
      this.userUrl + '/' + id + '/provider/portfolio-photos' + '/' + data.id,
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  getNotifications(id): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.get(
      this.userUrl + '/' + id + '/notification-settings-list',
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  setNotificationsSetting(id, data): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.userUrl + '/' + id + '/notification-settings-list',
      data,
      {headers: headers}
    ).map(this.extractData).catch(this.handleErrors);
  }

  extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  private handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}

