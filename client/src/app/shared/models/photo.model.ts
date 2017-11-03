import { TypeItem } from './dictionary.model';

export class Photo extends TypeItem {
  is_approved: boolean;
  is_idea_for_inspiration: boolean;
  is_visible: boolean;
  inspiration_category_id: number;
  photo_after_url: string;
  photo_before_url: string;
  photo_simple_url: string;
  provider_id: number;
  service_id: number;
  Provider: {};

  constructor(obj?: any) {
    super();
    this.id                       = obj && obj.id                       || null;
    this.description              = obj && obj.description              || null;
    // this.is_approved              = obj && obj.is_approved              || null;
    this.is_approved              = obj && obj.is_approved              || false;
    this.is_idea_for_inspiration  = obj && obj.is_idea_for_inspiration  || null;
    this.is_visible               = obj && obj.is_visible               || false;
    this.inspiration_category_id  = obj && obj.inspiration_category_id  || null;
    this.photo_after_url          = obj && obj.photo_after_url          || null;
    this.photo_before_url         = obj && obj.photo_before_url         || null;
    this.photo_simple_url         = obj && obj.photo_simple_url         || null;
    this.provider_id              = obj && obj.provider_id              || null;
    this.service_id               = obj && obj.service_id               || null;
    this.Provider                 = obj && obj.Provider                 || null;
  }
}
