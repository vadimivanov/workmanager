import { TypeItem } from './dictionary.model';

export class Category extends TypeItem {
  constructor(obj?: any) {
    super();
    this.id          = obj && obj.id                    || null;
    this.description = obj && obj.description           || null;
    this.name        = obj && obj.name                  || null;
    this.isShowOnHomePage = obj && obj.isShowOnHomePage || false;
  }
}
