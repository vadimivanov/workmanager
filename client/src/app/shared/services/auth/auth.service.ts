import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import config from '../../config';
import { User } from '../../models/user.model';
import { NetworkService } from '../network/network.service';

@Injectable()
export class AuthService {
  private authUrl: string = config.apiUrl + 'auth/';
  private signUpUrl: string = this.authUrl + 'sign-up/';
  private usersUrl: string = config.apiUrl + 'users/';

  constructor(private http: NetworkService) { }

  register(user: User, role?: string): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post(
      this.signUpUrl + role,
      JSON.stringify({
        login: user.login,
        email: user.email,
        password: user.password
      }),
      { headers: headers }
    ).map(this.extractData).catch(this.handleErrors);
  }

  signup(user: any, id: number, token: string, role: string): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', token);

    return this.http.put(
      config.apiUrl + 'api/v1/users/' + id + '/' + role,
      user,
      { headers: headers }
    ).map(this.extractData).catch(this.handleErrors);
  }

  login(user: User): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post(
      this.authUrl + 'sign-in',
      JSON.stringify({
        email: user.email,
        password: user.password
      }),
      { headers: headers }
    ).map(this.extractData).catch(this.handleErrors);

  }

  saveSubcategories(id, categories, token) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', token);

    return this.http.post(
      config.apiUrl + 'api/v1/users/' + id + '/provider/subservices',
      JSON.stringify(categories),
      { headers: headers }
    ).map(this.extractData).catch(this.handleErrors);
  }

  confirmation(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Authorization', token);

    return this.http.get(
      config.apiUrl + 'api/v1/users/' + id + '/request-email-confirmation',
      { headers: headers }
    ).map(this.extractData).catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }

  extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  setUser(user): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUserRole(): string {
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser')).user.role;
    } else {
      return 'Unregister';
    }
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

}
