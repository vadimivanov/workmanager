import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { AuthService } from '../../shared/services/auth/auth.service';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { InfoDialogComponent } from '../../shared/components/modals/info-dialog/info-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  currentUser: any;
  queryParams: any;
  authToken: string;
  isBillingCard: boolean;
  isLoad = false;
  currentPlanId: string;
  userRole: string;
  userBillingPlan: number;
  stripeAccountId: string;
  availablePlans = ['Bewerter', 'Basic', 'Silver', 'Gold'];
  plansId = ['1-basic', '2-silver', '3-gold'];
  isCanManagePlans = false;

  constructor(
    public dialog: MdDialog,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService) {}

  ngOnInit() {
    this.getBillingPlans();
    this.currentUser = this.authService.getUser();

    if (this.currentUser && this.currentUser.user) {
      this.currentPlanId = this.currentUser.user.stripe_subscription.plan.id;
      this.isCanManagePlans = this.plansId.indexOf(this.currentPlanId) !== -1;
      this.setComponentData();
    }
    this.queryParams = this.route.queryParams;
    if (this.queryParams._value.is_redirected) {
      this.openDialog();
    }
  }

  setComponentData(): void {
    this.userRole = this.currentUser.user.role;
    if (this.currentUser.user) {
      this.userBillingPlan = this.availablePlans.indexOf(this.currentUser.user.stripe_subscription.plan.name);
    } else {
      this.userBillingPlan = null;
    }
    this.stripeAccountId = this.currentUser.user.stripe_account_id;
  }

  getBillingPlans() {
    this.profileService.getBillingPlans().subscribe(
      (resp) => {
      }
    );
  }

  navigateUser(planId?): void {
    if (!this.isLoad) {
      if (this.userRole === 'Provider') {
        this.isLoad = true;
        this.profileService.checkBillingCard(this.currentUser.user.id).subscribe(
          (resp) => {
            if (resp._body) {
              this.isBillingCard = JSON.parse(resp._body).is_user_have_cards;
              this.confirmPlan(this.isBillingCard, planId);
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
      if (this.userRole !== 'Provider' && this.userRole !== 'Rater') {
        this.router.navigate(['/login']);
      }
    }
  }

  confirmPlan(cardFlag, planId): void {
    if (cardFlag) {
      this.confirmDialog(planId);
    } else {
      this.authToken = this.profileService.getToken();
      let queryToken = this.authToken.substring(this.authToken.indexOf('JWT') + 4, this.authToken.length);
      window.location.href = '/api/v1/users/' + this.currentUser.user.id + '/billing/card-form?jwtToken=' + queryToken;
    }
  }

  updatePlan(planId): void {
    this.profileService.changeBillingPlan(this.currentUser.user.id, planId).subscribe(
      (resp) => {
        this.updateCurrentUser();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateCurrentUser(): void {
    this.profileService.getUser(this.currentUser.user.id).subscribe(
      (resp) => {
        this.currentUser.user = JSON.parse(resp._body);
        this.authService.setUser(this.currentUser);
        this.currentUser = this.authService.getUser();
        if (this.currentUser.user) {
          this.currentPlanId = this.currentUser.user.stripe_subscription.plan.id;
        }
        this.setComponentData();
        this.isLoad = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  isDisabled(planId?): boolean {
    return (this.userRole === 'Rater') || (planId === this.userBillingPlan);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'The credit card was successfully added to your account. Choose a billing plan to use Okornok\'s  advanced options!';
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  confirmDialog(planId): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.infoText = 'Are you sure you want to change the billing plan ? Payment will be automatically collected from your card';
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.msg) {
        this.updatePlan(planId);
      } else {
        this.isLoad = false;
      }
    });
  }
}
