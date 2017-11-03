import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router } from '@angular/router';

import { NetworkService } from './shared/services/network/network.service';
import { UserAlertComponent } from './shared/components/modals/user-alert/user-alert.component';
import { FadeMaskComponent } from './shared/components/fade-mask/fade-mask.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./styles/index.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  @ViewChild('toast') userAlertComponent: UserAlertComponent;
  @ViewChild('spinner') fadeMaskComponent: FadeMaskComponent;
  public errorText: string;
  private maxInitNPBarVal = 60;
  private minInitNPBarVal = 25;
  static getDesktopType() {
    return ('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) ? 'is-touch' : 'is-desktop';
  }
  /**
   * Determine the mobile operating system.
   * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
   *
   * @returns {String}
   */
  static getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return 'is-windows';
    }

    if (/android/i.test(userAgent)) {
      return 'is-android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 'is-iOS';
    }

    return 'is-unknown';
  }

  constructor(
    networkService: NetworkService,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router) {
    networkService.showModal.subscribe((error) => {
      this.errorText = error;
      this.show();
      if (error === 'Blocked user!') {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/home']);
      }
    });
    networkService.showSpinner.subscribe((val) => {
      this.progressBar(val);
    });
  }

  ngOnInit() {
    const body = document.querySelector('body');
    body.classList.add(AppComponent.getMobileOperatingSystem());
    body.classList.add(AppComponent.getDesktopType());
  }

  progressBar(val) {
    if (val) {
      this.slimLoadingBarService.start();
      this.slimLoadingBarService.progress = this.minInitNPBarVal;
    } else {
      this.slimLoadingBarService.complete();
    }
  }

  show() {
    this.userAlertComponent.show();
  }

  onDeactivate() {
    document.body.scrollTop = 0;
  }
}
