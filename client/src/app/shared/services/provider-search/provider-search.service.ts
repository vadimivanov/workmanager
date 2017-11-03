import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import config from '../../../shared/config';
import { ProviderCompany } from '../../models/provider-company.model';
import { NetworkService } from '../network/network.service';

@Injectable()
export class ProviderSearchService {
  private providersUrl: string = config.apiUrl + 'api/v1/providers';
  private mapPlan = {
    Gold: 2,
    Silver: 1,
    Basic: 0
  };

  constructor(private http: NetworkService) { }

  doSearch(searchText, location): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.providersUrl + this.createUrl(searchText, location),
      { headers: headers }
    ).map((response: Response) => {
      if (<any>response.json()) {
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
            subServices: item.Provider.Subservices,
            subMetatags: item.Provider.Subservices.length ? this.filteringSubMetatags(item.Provider.Subservices) : null,
            serviceMetatags: item.Provider.Subservices.length ? this.filteringServiceMetatags(item.Provider.Subservices) : null,
            telephone_number: item.Provider.telephone_number,
            user_id: item.Provider.user_id,
            zip_code: item.Provider.zip_code
          });
        });
      } else {
        return response;
      }
    });
  }

  filteringSubMetatags(service) {
    let sub = {
      subService: [],
      metatags: []
    };
    let metatags = [];
    let temp;
    for (let i = 0; i < service.length; i++) {
      if (service[i].metatags != null) {
        temp = metatags.concat(service[i].metatags);
        sub.subService.push({
          id: service[i].id,
          service_id: service[i].service_id,
          name: service[i].name,
          metatags: service[i].metatags
        });
      }
    }
    sub.metatags = temp;

    return sub;
  }

  filteringServiceMetatags(service) {
    let sub = {
      service: [],
      metatags: []
    };
    let metatags = [];
    let temp;
    for (let i = 0; i < service.length; i++) {
      if (service[i].Service.metatags != null) {
        temp = metatags.concat(service[i].Service.metatags);
        sub.service.push({
          id: service[i].Service.id,
          name: service[i].Service.name,
          metatags: temp
        });
      }
    }
    sub.metatags = temp;

    return sub;
  }

  createUrl(searchText, location): string {
    let urlPart: string = '';
    if (searchText) {
      urlPart += '?searchText=' + searchText;
    }
    if (location) {
      urlPart += '?longitude=' + location.longitude + '&latitude=' + location.latitude + '&distance=' + location.distance;
    }
    return urlPart;
  }

  mainSearch(searchParams): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(
      this.providersUrl + this.createSearchUrl(searchParams),
      { headers: headers }
    ).map((response: Response) => {
      if (<any>response.json() != null) {
        return (<any>response.json()).map(item => {
          return new ProviderCompany({
            subServices: item.Provider.Subservices,
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
            zip_code: item.Provider.zip_code,
            stripe_subscription: item.stripe_subscription ? new Object({
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
                trial_period_days: item.stripe_subscription.plan.trial_period_days,
                magnitude: this.mapPlan[item.stripe_subscription.plan.name]
              },
              quantity: item.stripe_subscription.quantity,
              start: item.stripe_subscription.start,
              status: item.stripe_subscription.status,
              tax_percent: item.stripe_subscription.tax_percent,
              trial_end: item.stripe_subscription.trial_end,
              trial_start: item.stripe_subscription.trial_start
            })  : {}
          });
        });
      } else {
        return response.json();
      }
    });
  }

  createSearchUrl(data): string {
    let urlPart: any = ['?'];
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        urlPart.push(data[i].searchKey + '=' + data[i].searchValue);
      }
    }
    return urlPart.join('&');
  }
}
