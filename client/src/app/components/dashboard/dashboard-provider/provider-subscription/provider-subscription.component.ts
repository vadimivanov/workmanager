import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { AuthService } from '../../../../shared/services/auth/auth.service';
import { ProfileService } from '../../../../shared/services/profile/profile.service';

@Component({
  selector: 'app-provider-subscription',
  templateUrl: './provider-subscription.component.html',
  styleUrls: ['./provider-subscription.component.scss']
})
export class ProviderSubscriptionComponent implements OnInit {
  availablePlans: [string] = ['Bewerter', 'Basic', 'Silver', 'Gold'];
  plansId: [string] = ['1-basic', '2-silver', '3-gold'];
  currentUser: any;
  userRole: string;
  userBillingPlan: number;
  stripeAccountId: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    if (this.currentUser && this.currentUser.user) {
      this.setComponentData();
    }
  }

  setComponentData() {
    this.userRole = this.currentUser.user.role;
    this.userBillingPlan = this.availablePlans.indexOf(this.currentUser.user.stripe_subscription.plan.name);
    this.stripeAccountId = this.currentUser.user.stripe_account_id;
  }

  goToBilling() {
    this.router.navigate(['/billing']);
  }

}
