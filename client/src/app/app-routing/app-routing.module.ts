import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../components/auth/login/login.component';
import { ForgotPasswordComponent } from '../components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../components/auth/reset-password/reset-password.component';
import { SignUpComponent } from '../components/auth/sign-up/sign-up.component';
import { SignUpRaterComponent } from '../components/auth/sign-up/sign-up-rater/sign-up-rater.component';
import { SignUpProviderComponent } from '../components/auth/sign-up/sign-up-provider/sign-up-provider.component';
import { HomeComponent } from '../components/home/home.component';
import { AboutUsComponent } from '../components/about-us/about-us.component';
import { HowItWorksProviderComponent } from '../components/how-it-works-provider/how-it-works-provider.component';
import { HowItWorksRaterComponent } from '../components/how-it-works-rater/how-it-works-rater.component';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from '../components/terms-conditions/terms-conditions.component';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { routes as childRoutes } from '../components/auth/auth.module';
import { BillingComponent } from '../components/billing/billing.component';
import { TestComponent } from '../components/test/test.component';
import { CategoriesComponent } from '../components/categories/categories.component';
import { FeedbackComponent } from '../components/feedback/feedback.component';
import { RaterProfileComponent } from '../components/rater-profile/rater-profile.component';
import { ProviderProfileComponent } from '../components/provider-profile/provider-profile.component';
import { FeedbackRequestComponent } from '../components/feedback-request/feedback-request.component';
import { IdeasForInspirationComponent } from '../components/ideas-for-inspiration/ideas-for-inspiration.component';
import { IdeasForInspirationGalleryComponent } from '../shared/components/ideas-for-inspiration-gallery/ideas-for-inspiration-gallery.component';
import { MainSearchComponent } from '../components/main-search/main-search.component';
import { SearchResultComponent } from '../components/main-search/search-result/search-result.component';
import { DashboardRaterComponent } from '../components/dashboard/dashboard-rater/dashboard-rater.component';
import { DashboardProviderComponent } from '../components/dashboard/dashboard-provider/dashboard-provider.component';
import { DashboardSupporterComponent } from '../components/dashboard/dashboard-supporter/dashboard-supporter.component';

/**
 * Route guard example: canActivate: [LoggedInGuard]
 */
const routes: Routes = [
  {path: 'rater-profile', component: RaterProfileComponent},
  {path: 'rater-profile/:id', component: RaterProfileComponent},
  {path: 'home', component: HomeComponent},
  {path: 'categories', component: CategoriesComponent},
  {
    path: 'feedback',
    component: FeedbackComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'feedback-request',
    component: FeedbackRequestComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Provider'] }
  },
  {path: 'billing', component: BillingComponent},
  {path: 'test', component: TestComponent},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Unregister'] }
  },
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {
    path: 'register',
    component: SignUpComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Unregister'] }
  },
  {
    path: 'register/rater',
    component: SignUpRaterComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Unregister'] }
  },
  {
    path: 'register/provider',
    component: SignUpProviderComponent,
    children: childRoutes,
    canActivate: [RoleGuard],
    data: { roles: ['Unregister'] }
  },
  {path: 'about-us', component: AboutUsComponent},
  {path: 'how-it-works-provider', component: HowItWorksProviderComponent},
  {path: 'how-it-works-rater', component: HowItWorksRaterComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'terms-conditions', component: TermsConditionsComponent},
  {
    path: 'provider-profile',
    component: ProviderProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Provider'] }
  },
  {path: 'provider-profile/:id', component: ProviderProfileComponent},
  {path: 'ideas-for-inspiration', component: IdeasForInspirationGalleryComponent},
  {path: 'search', component: MainSearchComponent},
  {path: 'search-result', component: SearchResultComponent},
  {
    path: 'dashboard-provider',
    component: DashboardProviderComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Provider'] }
  },
  {
    path: 'dashboard-rater',
    component: DashboardRaterComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Rater'] }
  },
  {
    path: 'dashboard-supporter',
    component: DashboardSupporterComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
