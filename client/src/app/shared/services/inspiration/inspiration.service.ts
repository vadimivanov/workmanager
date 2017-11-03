import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import config from '../../../shared/config';
import { NetworkService } from '../network/network.service';
import { Photo } from '../../models/photo.model';
import { Category } from '../../models/category.model';

@Injectable()
export class InspirationService {
  private photosUrl: string = config.apiUrl + 'api/v1/inspiration-photos';
  private categoriesUrl: string = config.apiUrl + 'api/v1/inspiration-categories';

  constructor(private http: NetworkService) { }

  getPhotos(id?: string, limit?: number, offset?: number): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.photosUrl + this.createUrl(id, limit, offset),
      { headers: headers }
    ).map((response: Response) => {
      return (<any>response.json()).map(item => {
        return new Photo({
          id: item.id,
          description: item.description,
          is_approved: item.is_approved,
          is_idea_for_inspiration: item.is_idea_for_inspiration,
          is_visible: item.is_visible,
          photo_after_url: item.photo_after_url,
          photo_before_url: item.photo_before_url,
          photo_simple_url: item.photo_simple_url,
          provider_id: item.provider_id,
          inspiration_category_id: item.inspiration_category_id,
          service_id: item.service_id,
          Provider: item.Provider
        });
      });
    });
  }

  getCategories(id?: string): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      this.categoriesUrl + this.createUrl(id),
      { headers: headers }
    ).map((response: Response) => {
      return (<any>response.json()).map(item => {
        return new Category({
          id: item.id,
          isShowOnHomePage: item.is_show_on_home_page,
          description: item.description,
          name: item.name
        });
      });
    });
  }

  createUrl(id, limit?, offset?): string {
    let urlPart = '';
    if (id) {
      urlPart += '/' + id;
    }
    if (limit && offset || limit && offset === 0) {
      urlPart += '?' + 'limit=' + limit + '&' + 'offset=' + offset;
    }
    return urlPart;
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || { };
  }

  private handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }

}
