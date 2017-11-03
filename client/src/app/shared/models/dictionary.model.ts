import { KrnNetworkModel } from './krn-model';

export class KrnDictionary implements KrnNetworkModel {
  id: number;
  name: string;
}

export class TypeItem extends KrnDictionary {
  description: string;
  isShowOnHomePage: boolean;
}
