import { TypeItem } from './dictionary.model';
import { ProviderSubscription } from './provider-subscription.model';

export class ProviderCompany extends TypeItem {
  about: string;
  city: string;
  company_name: string;
  first_name_of_representative: string;
  foundation_year: string;
  gender: string;
  hours_of_operation: string;
  house_number: number;
  last_name_of_representative: string;
  locations: [{
    city: string
    created_at: string
    house_number: string
    id: number
    location_coordinates: {
      lat: number,
      lng: number
    }
    name: string
    provider_id: number
    street: string
    updated_at: string
    zip_code: number
  }];
  number_of_employees: number;
  photo_url: string;
  rating: number;
  street: string;
  telephone_number: number;
  user_id: number;
  zip_code: number;
  stripe_subscription: ProviderSubscription;
  subServices: any[];
  subMetatags: any[];
  serviceMetatags: any[];
  created_at: Date;
  email: string;
  is_enabled: boolean;
  is_self_registered: boolean;

  constructor(obj?: any) {
    super();
    this.id                           = obj && obj.id                           || null;
    this.about                        = obj && obj.about                        || null;
    this.city                         = obj && obj.city                         || null;
    this.company_name                 = obj && obj.company_name                 || null;
    this.first_name_of_representative = obj && obj.first_name_of_representative || null;
    this.foundation_year              = obj && obj.foundation_year              || null;
    this.gender                       = obj && obj.gender                       || null;
    this.hours_of_operation           = obj && obj.hours_of_operation           || null;
    this.house_number                 = obj && obj.house_number                 || null;
    this.last_name_of_representative  = obj && obj.last_name_of_representative  || null;
    this.locations                    = obj && obj.locations                    || null;
    this.number_of_employees          = obj && obj.number_of_employees          || null;
    this.photo_url                    = obj && obj.photo_url                    || null;
    this.rating                       = obj && obj.rating                       || null;
    this.street                       = obj && obj.street                       || null;
    this.telephone_number             = obj && obj.telephone_number             || null;
    this.user_id                      = obj && obj.user_id                      || null;
    this.zip_code                     = obj && obj.zip_code                     || null;
    this.stripe_subscription          = obj && obj.stripe_subscription          || null;
    this.subServices                  = obj && obj.subServices                  || null;
    this.subMetatags                  = obj && obj.subMetatags                  || null;
    this.serviceMetatags              = obj && obj.serviceMetatags              || null;
    this.created_at                   = obj && obj.created_at                   || null;
    this.email                        = obj && obj.email                        || null;
    this.is_enabled                   = obj && obj.is_enabled                   || false;
    this.is_self_registered           = obj && obj.is_self_registered           || false;
  }
}
