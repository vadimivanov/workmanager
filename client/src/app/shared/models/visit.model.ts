import { TypeItem } from './dictionary.model';

export class Visit extends TypeItem {
  created_at: any;
  updated_at: any;
  location_coordinates: any;
  provider_id: number;
  service: string;

  constructor(obj?: any) {
    super();
    this.id                   = obj && obj.id                   || null;
    this.created_at           = obj && obj.created_at           || null;
    this.updated_at           = obj && obj.updated_at           || null;
    this.location_coordinates = obj && obj.location_coordinates || null;
    this.provider_id          = obj && obj.provider_id          || null;
    this.service              = obj && obj.service              || null;
  }
}
