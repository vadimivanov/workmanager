import {User} from './user.model';

export class Provider extends User {
  companyName: string;
  companyAddress: string;
  companyAddress2: string;
  companyPlz: string;
  companyOrt: string;
  servicesMap: Object;
  subscribe: boolean;
  photoUrl: string;
  providerId: number;
  locations: {
    latitude: number,
    longitude: number
  };
}
