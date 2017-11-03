import { TypeItem } from './dictionary.model';

export class ProviderServices extends TypeItem {
  isApproved: boolean;
  metatags: string[];
  rating: number;
  Subservices: ProviderServices;
}
