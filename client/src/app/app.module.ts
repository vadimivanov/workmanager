import { BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { NouisliderComponent } from 'ng2-nouislider';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { LightboxModule } from 'angular2-lightbox';
import { ContextMenuModule } from 'angular2-contextmenu';

import { NetworkService } from './shared/services/network/network.service';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './components/auth/auth.module';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { HowItWorksProviderComponent } from './components/how-it-works-provider/how-it-works-provider.component';
import { HowItWorksRaterComponent } from './components/how-it-works-rater/how-it-works-rater.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { BillingComponent } from './components/billing/billing.component';
import { TestComponent } from './components/test/test.component';
import { RaterProfileComponent } from './components/rater-profile/rater-profile.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackRequestComponent } from './components/feedback-request/feedback-request.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { ProviderInfoComponent } from './components/provider-profile/provider-info/provider-info.component';
import { ProviderPortfolioComponent } from './components/provider-profile/provider-portfolio/provider-portfolio.component';
import { ProviderServicesComponent } from './components/provider-profile/provider-services/provider-services.component';
import { ProviderStaffComponent } from './components/provider-profile/provider-staff/provider-staff.component';
import { EditablePopupComponent } from './shared/components/editable-popup/editable-popup.component';
import { IdeasForInspirationComponent } from './components/ideas-for-inspiration/ideas-for-inspiration.component';
import { UploadPhotoComponent } from './shared/components/modals/upload-photo/upload-photo.component';
import { ConfirmDialogComponent } from './shared/components/modals/confirm-dialog/confirm-dialog.component';
import { HomeSearchComponent } from './components/home/home-search/home-search.component';
import { MainSearchComponent } from './components/main-search/main-search.component';
import { SearchResultComponent } from './components/main-search/search-result/search-result.component';
import { FillProviderDataComponent } from './shared/components/modals/fill-provider-data/fill-provider-data.component';
import { CategoriesListComponent } from './components/categories/categories-list/categories-list.component';
import { DashboardRaterComponent } from './components/dashboard/dashboard-rater/dashboard-rater.component';
import { RaterGeneralInfoComponent } from './components/dashboard/dashboard-rater/rater-general-info/rater-general-info.component';
import { RaterPasswordComponent } from './components/dashboard/dashboard-rater/rater-password/rater-password.component';
import { RaterNotificationsComponent } from './components/dashboard/dashboard-rater/rater-notifications/rater-notifications.component';
import { RaterFeedbacksComponent } from './components/dashboard/dashboard-rater/rater-feedbacks/rater-feedbacks.component';
import { RaterFeedbackRequestsComponent } from './components/dashboard/dashboard-rater/rater-feedback-requests/rater-feedback-requests.component';
import { DashboardProviderComponent } from './components/dashboard/dashboard-provider/dashboard-provider.component';
import { ProviderGeneralInfoComponent } from './components/dashboard/dashboard-provider/provider-general-info/provider-general-info.component';
import { ProviderSubscriptionComponent } from './components/dashboard/dashboard-provider/provider-subscription/provider-subscription.component';
import { ProviderStatisticsComponent } from './components/dashboard/dashboard-provider/provider-statistics/provider-statistics.component';
import { ProviderNotificationComponent } from './components/dashboard/dashboard-provider/provider-notification/provider-notification.component';
import { ProviderPasswordComponent } from './components/dashboard/dashboard-provider/provider-password/provider-password.component';
import { InfoDialogComponent } from './shared/components/modals/info-dialog/info-dialog.component';
import { ProviderListComponent } from './components/dashboard/dashboard-supporter/provider-list/provider-list.component';
import { RaterListComponent } from './components/dashboard/dashboard-supporter/rater-list/rater-list.component';
import { EventsListComponent } from './components/dashboard/dashboard-supporter/events-list/events-list.component';
import { SupporterPasswordComponent } from './components/dashboard/dashboard-supporter/supporter-password/supporter-password.component';
import { DashboardSupporterComponent } from './components/dashboard/dashboard-supporter/dashboard-supporter.component';
import { SearchItemComponent } from './components/main-search/search-item/search-item.component';
import { ProblemReportComponent } from './shared/components/modals/problem-report/problem-report.component';
import { ProblemReportAcceptComponent } from './shared/components/modals/problem-report-accept/problem-report-accept.component';
import { PortfolioEventComponent } from './shared/components/modals/portfolio-event/portfolio-event.component';
import { FeedbackEventComponent } from './shared/components/modals/feedback-event/feedback-event.component';
import { FeedbackRequestEventComponent } from './shared/components/modals/feedback-request-event/feedback-request-event.component';
import { CardFormComponent } from './shared/components/modals/card-form/card-form.component';
import { CreateReportProblemComponent } from './shared/components/modals/create-report-problem/create-report-problem.component';
import { FeedbackDeclineComponent } from './shared/components/modals/feedback-decline/feedback-decline.component';

export function httpFactory(backend: XHRBackend, options: RequestOptions) {
  return new NetworkService(backend, options);
}

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule,
    AuthModule,
    AppRoutingModule,
    ChartsModule,
    LightboxModule,
    ContextMenuModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyC-hMoQRbdPa8f03E2fD_L7Fch6kt76EHQ'})
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    HowItWorksProviderComponent,
    HowItWorksRaterComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    BillingComponent,
    TestComponent,
    RaterProfileComponent,
    TermsConditionsComponent,
    NouisliderComponent,
    FeedbackComponent,
    FeedbackRequestComponent,
    CategoriesComponent,
    ProviderProfileComponent,
    ProviderInfoComponent,
    EditablePopupComponent,
    ProviderPortfolioComponent,
    ProviderStaffComponent,
    IdeasForInspirationComponent,
    UploadPhotoComponent,
    HomeSearchComponent,
    ProviderServicesComponent,
    ConfirmDialogComponent,
    MainSearchComponent,
    SearchResultComponent,
    CategoriesListComponent,
    FillProviderDataComponent,
    DashboardRaterComponent,
    RaterGeneralInfoComponent,
    RaterPasswordComponent,
    RaterNotificationsComponent,
    RaterFeedbacksComponent,
    DashboardProviderComponent,
    ProviderGeneralInfoComponent,
    ProviderSubscriptionComponent,
    ProviderStatisticsComponent,
    ProviderNotificationComponent,
    ProviderPasswordComponent,
    InfoDialogComponent,
    ProviderListComponent,
    RaterListComponent,
    EventsListComponent,
    SupporterPasswordComponent,
    DashboardSupporterComponent,
    SearchItemComponent,
    ProblemReportComponent,
    ProblemReportAcceptComponent,
    PortfolioEventComponent,
    FeedbackEventComponent,
    SafeHtmlPipe,
    FeedbackRequestEventComponent,
    CardFormComponent,
    CreateReportProblemComponent,
    RaterFeedbackRequestsComponent,
    FeedbackDeclineComponent
  ],
  entryComponents: [
    EditablePopupComponent,
    UploadPhotoComponent,
    ConfirmDialogComponent,
    FillProviderDataComponent,
    InfoDialogComponent,
    ProblemReportComponent,
    ProblemReportAcceptComponent,
    PortfolioEventComponent,
    FeedbackEventComponent,
    FeedbackRequestEventComponent,
    CardFormComponent,
    CreateReportProblemComponent,
    FeedbackDeclineComponent,
    CategoriesListComponent
  ],
  providers: [
    EditablePopupComponent,
    UploadPhotoComponent,
    FillProviderDataComponent,
    // ContextMenuModule,
    NetworkService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
