import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
declare var $: any;

@Injectable()
export class NetworkService extends Http {
  public pendingRequests: number = 0;
  public showLoading: boolean = false;
  public showModal: Subject<any> = new Subject<any>();
  public showSpinner: Subject<any> = new Subject<any>();

  constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, options));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, options));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    this.turnOnSpinner();
    this.pendingRequests++;
    return observable
      .catch(this.handleErrors.bind(this))
      .do((res: Response) => {
        this.turnOnSpinner();
      }, (err: any) => {
        this.turnOffSpinner();
      })
      .finally(() => {
        let timer = Observable.timer(1000);
        timer.subscribe(t => {
          this.turnOffSpinner();
        });
      });
  }

  private turnOnSpinner() {
    if (!this.showLoading) {
      this.showLoading = true;
      this.showSpinner.next(true);
      // show spinner
    }
    this.showLoading = true;
    this.showSpinner.next(true);
  }

  private turnOffSpinner() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      if (this.showLoading) {
        // show spinner
        this.showSpinner.next(true);
      }
      this.showLoading = false;
      this.showSpinner.next(false);
    }
  }

  handleErrors(error: Response) {
    this.showModal.next(error.json().message || error.json().msg);
    return Observable.throw(error);
  }
}
