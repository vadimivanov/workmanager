import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import config from '../../../shared/config';
import { ProviderCompany } from '../../models/provider-company.model';
import { ProviderSubscription } from '../../models/provider-subscription.model';
import { NetworkService } from '../network/network.service';

@Injectable()
export class ProviderServicesService {
  private servicesUrl: string = config.apiUrl + 'api/v1/services';
  private providersUrl: string = config.apiUrl + 'api/v1/providers';
  private ratersUrl: string = config.apiUrl + 'api/v1/raters';
  private feedbacksUrl: string = config.apiUrl + 'api/v1/feedbacks';
  private usersUrl: string = config.apiUrl + 'api/v1/users';
  private authToken: string;

  public services = <BehaviorSubject<any>>new BehaviorSubject([]);

  constructor(private http: NetworkService) {
    this.authToken = '';
    this.getServices().subscribe();

  }

  getToken() {
    this.authToken = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).JWT : '';
    return this.authToken;
  }

  editUser(id, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.put(
      this.usersUrl + '/' + id,
      data,
      { headers: headers }
    ).catch(this.handleErrors);

  }

  deleteUser(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.delete(
      this.usersUrl + '/' + id,
      { headers: headers }
    ).catch(this.handleErrors);

  }

  getServices(): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      config.apiUrl + 'api/v1/services',
      { headers: headers }
    ).do((res) => {
      this.services.next(res.json());
    }).map(this.extractData).catch(this.handleErrors);
  }

  getService(serviceId): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      config.apiUrl + 'api/v1/services/' + serviceId,
      { headers: headers }
    ).map(this.extractData).catch(this.handleErrors);
  }

  getProviders(limit?: number, offset?: number, enabledFlag?: boolean): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.providersUrl + this.createUrl(limit, offset, enabledFlag),
      { headers: headers }
    ).map((response: Response) => {
      return (<any>response.json()).filter((item) => {

        return item.Provider;
      }).map(item => {
        return new ProviderCompany({
          id: item.Provider.id,
          about: item.Provider.about,
          city: item.Provider.city,
          company_name: item.Provider.company_name,
          first_name_of_representative: item.Provider.first_name_of_representative,
          foundation_year: item.Provider.foundation_year,
          gender: item.Provider.gender,
          hours_of_operation: item.Provider.hours_of_operation,
          house_number: item.Provider.house_number,
          last_name_of_representative: item.Provider.last_name_of_representative,
          locations: item.Provider.Locations,
          number_of_employees: item.Provider.number_of_employees,
          photo_url: item.Provider.photo_url,
          rating: item.Provider.rating,
          street: item.Provider.street,
          telephone_number: item.Provider.telephone_number,
          user_id: item.Provider.user_id,
          created_at: new Date(item.Provider.created_at),
          email: item.email,
          is_enabled: item.is_enabled,
          is_self_registered: item.is_self_registered,
          stripe_subscription: item.stripe_subscription ? new ProviderSubscription({
            application_fee_percent: item.stripe_subscription.application_fee_percent,
            cancel_at_period_end: item.stripe_subscription.cancel_at_period_end,
            canceled_at: item.stripe_subscription.canceled_at,
            created: item.stripe_subscription.created,
            current_period_end: item.stripe_subscription.current_period_end,
            current_period_start: item.stripe_subscription.current_period_start,
            customer: item.stripe_subscription.customer,
            discount: item.stripe_subscription.discount,
            ended_at: item.stripe_subscription.ended_at,
            items: item.stripe_subscription.items,
            livemode: item.stripe_subscription.livemode,
            metadata: item.stripe_subscription.metadata,
            plan: {
              amount: item.stripe_subscription.plan.amount,
              created: item.stripe_subscription.plan.created,
              currency: item.stripe_subscription.plan.currency,
              id: item.stripe_subscription.plan.id,
              interval: item.stripe_subscription.plan.interval,
              interval_count: item.stripe_subscription.plan.interval_count,
              livemode: item.stripe_subscription.plan.livemode,
              metadata: item.stripe_subscription.plan.metadata,
              name: item.stripe_subscription.plan.name,
              object: item.stripe_subscription.plan.object,
              statement_descriptor: item.stripe_subscription.plan.statement_descriptor,
              trial_period_days: item.stripe_subscription.plan.trial_period_days
            },
            quantity: item.stripe_subscription.quantity,
            start: item.stripe_subscription.start,
            status: item.stripe_subscription.status,
            tax_percent: item.stripe_subscription.tax_percent,
            trial_end: item.stripe_subscription.trial_end,
            trial_start: item.stripe_subscription.trial_start
          })  : {},
          zip_code: item.Provider.zip_code,
          subServices: item.Provider.Subservices.map(subService => {
            return new Object({
              description: subService.description,
              id: subService.id,
              name: subService.name,
              rating: subService.rating
            });
          })
        });
      });
    });
  }

  getRaters(limit?: number, offset?: number): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.ratersUrl + this.createUrl(limit, offset),
      { headers: headers }
    ).map((response: Response) => {
      return (<any>response.json());
    });
  }

  getCurrentRater(id): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.ratersUrl + '/' + id,
      { headers: headers }
    ).map((response: Response) => {
      return response.json();
    });
  }

  getTopProviders(): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.providersUrl + '?offset=0&limit=3',
      { headers: headers }
    ).map((response: Response) => {
      return (<any>response.json()).map(item => {
        return new Object(item.Provider);
      });
    });
  }

  getCurrentProvider(id): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.providersUrl + '/' + id,
      { headers: headers }
    ).map((response: Response) => {
      return response.json();
    });
  }

  getTopServices(): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.servicesUrl + '?offset=0&limit=3',
      { headers: headers }
    ).map((response: Response) => {
      return (<any>response.json()).map(item => {
        return new Object({
          description: item.description,
          id: item.id,
          name: item.name,
          rating: item.rating
        });
      });
    });
  }

  getProvidersSubservices(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.usersUrl + '/' + id + '/provider/subservices',
      { headers: headers }
    ).map((response: Response) => {
      return response.json() && (<any>response.json()).map(item => {
        return new Object({
          service_id: item.service_id,
          service: item.Service.name,
          id: item.id,
          name: item.name,
          description: item.description
        });
      });
    });
  }

  setProvidersSubservices(id, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.usersUrl + '/' + id + '/provider/subservices',
      data,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  changeLocations(id, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', this.getToken());

    return this.http.post(
      this.usersUrl + '/' + id + '/provider/locations',
      data,
      { headers: headers }
    ).catch(this.handleErrors);
  }

  getFeedbacks() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.feedbacksUrl,
      { headers: headers }
    ).map((response: Response) => {
      return (<any>response.json()).map(item => {
        return new Object({
          created_at : item.created_at,
          id : item.id,
          is_displaying : item.is_displaying,
          is_price_confidential : item.is_price_confidential,
          job_description : item.job_description,
          job_title : item.job_title,
          likes : item.likes,
          photo_urls : item.photo_urls,
          project_cost : item.project_cost,
          provider_email : item.provider_email,
          provider_id : item.provider_id,
          Provider : item.Provider,
          quality_of_friendliness : item.quality_of_friendliness,
          quality_of_price : item.quality_of_price,
          quality_of_timeschedule : item.quality_of_timeschedule,
          quality_of_work : item.quality_of_work,
          rating: Math.floor((item.quality_of_friendliness + item.quality_of_price + item.quality_of_timeschedule + item.quality_of_work) / 4),
          quoted_job_description : item.quoted_job_description,
          rater_id : item.rater_id,
          replies : item.replies,
          service_id : item.service_id
        });
      });
    });
  }

  createUrl(limit?, offset?, enabledFlag?): string {
    let urlPart: string = '';
    if (limit && offset || limit && offset === 0) {
      urlPart += '?' + 'limit=' + limit + '&' + 'offset=' + offset;
    }
    if (enabledFlag) {
      urlPart += '?' + 'isGettingDisabledUsers=' + enabledFlag + '&getAutomaticallyRegisteredUsers=true';
    }
    return urlPart;
  }

  handleErrors(error: Response) {
    return Observable.throw(error);
  }

  extractData(res: Response) {
    const body = res.json();
    return body || { };
  }

}
