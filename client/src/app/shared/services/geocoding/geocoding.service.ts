import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import config from '../../../shared/config';
import { NetworkService } from '../network/network.service';
import { GeoSearchResult } from '../../models/geo-search-result.model';

@Injectable()
export class GeocodingService {
  private geoApiUrl: string = config.geoApiUrl;
  private geoApiKey: string = config.geoApiKey;

  constructor(private http: NetworkService) {
  }

  getJSON(): Observable<any> {
    return this.http.get('./assets/postal-codes.json')
      .map((res: any) => {
        return res.json();
      });
  }

  search(query: string, type: string): Observable<GeoSearchResult[]> {
    let params: string = [
      `address=${query}`,
      `language=fr`,
      `key=${this.geoApiKey}`
    ].join('&');
    let queryUrl: string = `${this.geoApiUrl}?${params}`;
    return this.http.get(queryUrl)
      .map((response: Response) => {
        return (<any>response.json()).results.map(item => {
          return new GeoSearchResult({
            formattedAddress: item.formatted_address,
            city: type === 'city' ? query : item.address_components[1].long_name,
            location: type === 'zipCode' ? query : item.geometry.location
          });
        });
      });
  }

  reverseSearch(query: string): Observable<GeoSearchResult[]> {
    let params: string = [
      `latlng=${query}`,
      `language=de`,
      `key=${this.geoApiKey}`
    ].join('&');
    let queryUrl: string = `${this.geoApiUrl}?${params}`;
    return this.http.get(queryUrl)
      .map((response: Response) => {
        return (<any>response.json()).results.map(item => {
          for (let k = 0; k < item.address_components.length; k++) {
            if (item.address_components[k].types[0] === 'locality') {
              return new GeoSearchResult({
                city: item.address_components[k].long_name,
                location: item.geometry.location
              });
            }
          }
        });
      });
  }

  searchPart(val, part): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      '/api/v1/zip-codes?' + part + '=' + val,
      { headers: headers }
    ).map((response: Response) => {
      return response.json();
    });
  }

  searchCity(city): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get(
      'http://okornok.herokuapp.com/api/v1/zip-codes?cityPart=' + city,
      { headers: headers }
    ).map((response: Response) => {
      return response.json();
    });
  }
}
