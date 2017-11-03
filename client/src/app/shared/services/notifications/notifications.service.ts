import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import config from '../../../shared/config';
import { NetworkService } from '../network/network.service';
import { Visit } from '../../models/visit.model';

@Injectable()
export class NotificationsService {

  private usersUrl: string = config.apiUrl + 'api/v1/';
  private notificationsUrl: string = config.apiUrl + 'api/v1/notifications';
  private authToken: string;

  constructor(private http: NetworkService) {
    this.authToken = '';
  }

  getToken() {
    this.authToken = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).JWT : '';
    return this.authToken;
  }

  mapNotifications(list, obj, extendObj?) {
    if (list) {
      let rObj = {};
      if (extendObj) {
        rObj = {[extendObj.role]: {}};
        rObj[extendObj.role] = extendObj[extendObj.role];
      }
      for (let i in obj) {
        if (list[i]) {
          rObj[i] = list[i];
        } else {
          rObj[i] = obj[i];
        }
      }
      rObj['type'] = obj['type'];
      rObj['initiation_role'] = extendObj ? extendObj.role : obj['initiation_role'];

      if (extendObj) {
        rObj['initiation_role_name'] = extendObj.role.toLowerCase() === 'rater' ? 'Bewerter' : 'Dienstleister';
      } else {
        rObj['initiation_role_name'] = obj['initiation_role_name'];
      }
      return rObj;
    }
  }

  getFeedbackNotifications() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.notificationsUrl + '/feedback-notifications',
      { headers: headers }
    ).map((response: Response) => {
      const respData = {
        type: 'feedbacks',
        initiation_role: 'Rater',
        initiation_role_name: 'Bewerter',
        Rater: {},
        created_at: '',
        rater_id: null,
        is_approved: null,
        is_viewed: null,
        id: null,
        job_description: '',
        job_title: '',
        photo_urls: [],
        provider_id: null,
        quality_of_friendliness: null,
        quality_of_price: null,
        quality_of_timeschedule: null,
        quality_of_work: null,
        quoted_job_description: '',
        service_id: null
      };
      return response.json() !== null ? (<any>response.json()).map((item) => {
        respData.is_viewed = item.is_viewed;
        return this.mapNotifications(item.Feedback, respData);
      }) : [];
    });
  }

  updateFeedbackNotifications(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.usersUrl + 'feedbacks/' + data.feedbackId,
      data,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  getFeedbackRequest() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.notificationsUrl + '/feedback-request-notifications',
      { headers: headers }
    ).map((response: Response) => {
      const respData = {
        type: 'request',
        initiation_role: 'Provider',
        Provider: {},
        created_at: '',
        provider_id: null,
        photo_urls: [],
        is_approved: false,
        is_viewed: null,
        id: null,
        job_title: '',
        message: '',
        service_id: null,
      };
      return response.json() !== null ? (<any>response.json()).map((item) => {
        return this.mapNotifications(item.FeedbackRequest, respData);
      }) : [];
    });
  }

  getPortfolioNotifications() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.notificationsUrl + '/portfolio-photo-notifications',
      { headers: headers }
    ).map((response: Response) => {
      const respData = {
        type: 'portfolio',
        initiation_role: 'Provider',
        initiation_role_name: 'Dienstleister',
        Provider: {},
        created_at: '',
        description: '',
        provider_id: null,
        service_id: null,
        photo_simple_url: null,
        photo_before_url: null,
        photo_after_url: null,
        id: null,
        is_approved: false,
        is_viewed: null,
      };
      return response.json() !== null ? (<any>response.json()).map((item) => {
        respData.is_viewed = item.is_viewed;
        return this.mapNotifications(item.PortfolioPhoto, respData);
      }) : [];
    });
  }

  updatePortfolioPhotos(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.usersUrl + 'users/' + data.userId + '/provider/portfolio-photos/' + data.photoId,
      data,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  deletePortfolioPhotos(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.delete(
      this.usersUrl + 'users/' + data.userId + '/provider/portfolio-photos/' + data.photoId,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  getProblemsReports() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.usersUrl + 'problem-feedback-reports',
      { headers: headers }
    ).map((response: Response) => {
      const respData = {
        type: 'problem',
        Feedback: {},
        initiation_role: '',
        created_at: '',
        description: null,
        reason: null,
        user_id: null,
        id: null,
        is_approved: false,
        is_viewed: null,
      };
      return response.json() !== null ? (<any>response.json()).map((item) => {
        return this.mapNotifications(item, respData, item.User);
      }) : [];
    });
  }

  updateProblemReport(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.usersUrl + 'users/' + data.userId + '/problem-feedback-reports/' + data.problemId,
      data,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  getUser(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.usersUrl + 'providers/' + id,
      { headers: headers }
    ).map(this.extractData).catch(this.handleErrors);
  }

  extractData(res: Response) {
    const body = res.json();
    return body || { };
  }

  private handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }

}
