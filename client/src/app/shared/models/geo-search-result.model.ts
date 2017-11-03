export class GeoSearchResult {

  formattedAddress: string;
  city: string;
  zipCode: string;
  location: any;

  constructor(obj?: any) {
    this.formattedAddress   = obj && obj.formattedAddress || null;
    this.city               = obj && obj.city             || null;
    this.zipCode            = obj && obj.zipCode          || null;
    this.location           = obj && obj.location         || null;
  }
}
