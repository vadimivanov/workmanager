import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule,
  MdInputModule,
  MdCheckboxModule,
  MdSliderModule,
  MdIconModule,
  MdSelectModule,
  MdProgressSpinnerModule,
  MdDialogModule,
  MdTabsModule,
  MdMenuModule,
  MdAutocompleteModule,
  MdSnackBarModule,
  MdTooltipModule
} from '@angular/material';

import { ContextMenuModule } from 'angular2-contextmenu';
import { RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

// import { NetworkService } from './services/network/network.service';
import { MasonryModule } from 'angular2-masonry';
import { AuthService } from './services/auth/auth.service';
import { ProviderServicesService } from './services/provider-services/provider-services.service';
import { FormUtilsService } from './forms/form-utils.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterStepsComponent } from './components/register-steps/register-steps.component';
import { EmailValidatorDirective } from './components/validation/email-validator.directive';
import { LoggedInGuard } from './guards/logged-in.guard';
import { RoleGuard } from './guards/role.guard';
import { ProfileService } from './services/profile/profile.service';
import { SocialService } from './services/social/social.service';
import { GeocodingService } from './services/geocoding/geocoding.service';
import { InspirationService } from './services/inspiration/inspiration.service';
import { ProviderSearchService } from './services/provider-search/provider-search.service';
import { NotificationsService } from './services/notifications/notifications.service';
import { SocialComponent } from './components/social/social.component';
import { PagerService } from './services/pager/pager.service';
import { ClickStopPropagationDirective } from './components/stop-propagation.directive';
import { ImageInputComponent } from './components/form-controls/image-input/image-input.component';
import { UserAlertComponent } from './components/modals/user-alert/user-alert.component';
import { FadeMaskComponent } from './components/fade-mask/fade-mask.component';
import { IdeasForInspirationGalleryComponent } from './components/ideas-for-inspiration-gallery/ideas-for-inspiration-gallery.component';
import { GalleryComponent } from './components/gallery.component';
import { LatestProvidersComponent } from './components/latest-providers/latest-providers.component';
import { LatestFeedbacksComponent } from './components/latest-feedbacks/latest-feedbacks.component';
import { EditableInfoComponent } from './components/editable-info/editable-info.component';
import { VisualComponent } from './components/visual/visual.component';
import { InfoComponent } from './components/info/info.component';
import { ArticleComponent } from './components/article/article.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ControlGroupComponent } from './components/control-group/control-group.component';
import { CtaComponent } from './components/cta/cta.component';
import { PromoComponent } from './components/promo/promo.component';
import { SliderGroupComponent } from './components/slider-group/slider-group.component';
import { CutawayComponent } from './components/cutaway/cutaway.component';
import { FeedbackItemComponent } from './components/feedback/feedback.component';
import { CardComponent } from './components/card/card.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { PublicationComponent } from './components/publication/publication.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PortfolioGalleryComponent } from './components/portfolio-gallery/portfolio-gallery.component';
import { DialogService } from './services/dialog/dialog.service';
import { QuoteComponent } from './components/quote/quote.component';
import { ProfilePromoComponent } from './components/profile-promo/profile-promo.component';
import { ShifterComponent } from './components/shifter/shifter.component';
import { RatingComponent } from './components/rating/rating.component';
import { CommentComponent } from './components/comment/comment.component';
import { MemberComponent } from './components/member/member.component';
import { IsOnScreenDirective } from './is-on-screen.directive';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { SubjectComponent } from './components/subject/subject.component';
import { FilterComponent } from './components/filter/filter.component';
import { TextTruncateComponent } from './components/text-truncate/text-truncate.component';
import { IdeasForInspirationPortfolioComponent } from 'app/shared/components/ideas-for-inspiration-portfolio/ideas-for-inspiration-portfolio.component';
import { DatePipe } from './pipes/date/date.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MdButtonModule,
    MdInputModule,
    MdIconModule,
    MdTabsModule,
    MdMenuModule,
    MdAutocompleteModule,
    MdSnackBarModule,
    MdCheckboxModule,
    MdSliderModule,
    MdSelectModule,
    MdProgressSpinnerModule,
    MdDialogModule,
    MdTooltipModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    // ContextMenuModule,
    SlimLoadingBarModule.forRoot(),
    RecaptchaModule.forRoot()
  ],
  exports: [
    CommonModule,
    MdButtonModule,
    MdInputModule,
    MdCheckboxModule,
    MdIconModule,
    MdTabsModule,
    MdMenuModule,
    MdAutocompleteModule,
    MdSnackBarModule,
    MdSelectModule,
    MdSliderModule,
    MdProgressSpinnerModule,
    MdDialogModule,
    MdTooltipModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SlimLoadingBarModule,
    HeaderComponent,
    FooterComponent,
    RegisterStepsComponent,
    RegisterStepsComponent,
    EmailValidatorDirective,
    ClickStopPropagationDirective,
    SocialComponent,
    ImageInputComponent,
    MasonryModule,
    UserAlertComponent,
    FadeMaskComponent,
    EditableInfoComponent,
    IdeasForInspirationGalleryComponent,
    GalleryComponent,
    VisualComponent,
    InfoComponent,
    ArticleComponent,
    ContactFormComponent,
    ControlGroupComponent,
    CtaComponent,
    PromoComponent,
    SliderGroupComponent,
    CutawayComponent,
    FeedbackItemComponent,
    GalleryComponent,
    LatestProvidersComponent,
    LatestFeedbacksComponent,
    IdeasForInspirationPortfolioComponent,
    PortfolioGalleryComponent,
    LatestFeedbacksComponent,
    CardComponent,
    UserInfoComponent,
    PublicationComponent,
    CarouselComponent,
    PaginationComponent,
    ProfilePromoComponent,
    QuoteComponent,
    ShifterComponent,
    RatingComponent,
    CommentComponent,
    MemberComponent,
    IsOnScreenDirective,
    ImageSliderComponent,
    // ContextMenuModule,
    SubjectComponent,
    FilterComponent,
    TextTruncateComponent,
    DatePipe
  ],
  providers: [
    AuthService,
    ProviderServicesService,
    FormUtilsService,
    LoggedInGuard,
    RoleGuard,
    ProfileService,
    SocialService,
    GeocodingService,
    InspirationService,
    DialogService,
    ProviderSearchService,
    NotificationsService,
    PagerService,
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'de',
    }
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SocialComponent,
    RegisterStepsComponent,
    EmailValidatorDirective,
    ClickStopPropagationDirective,
    ImageInputComponent,
    UserAlertComponent,
    FadeMaskComponent,
    EditableInfoComponent,
    IdeasForInspirationGalleryComponent,
    GalleryComponent,
    VisualComponent,
    InfoComponent,
    ArticleComponent,
    ContactFormComponent,
    ControlGroupComponent,
    CtaComponent,
    PromoComponent,
    SliderGroupComponent,
    CutawayComponent,
    FeedbackItemComponent,
    GalleryComponent,
    LatestProvidersComponent,
    LatestFeedbacksComponent,
    CardComponent,
    UserInfoComponent,
    PublicationComponent,
    CarouselComponent,
    PaginationComponent,
    LatestFeedbacksComponent,
    IdeasForInspirationPortfolioComponent,
    PortfolioGalleryComponent,
    QuoteComponent,
    ProfilePromoComponent,
    ShifterComponent,
    RatingComponent,
    CommentComponent,
    MemberComponent,
    IsOnScreenDirective,
    ImageSliderComponent,
    // ContextMenuModule,
    SubjectComponent,
    FilterComponent,
    TextTruncateComponent,
    DatePipe
  ]
})
export class SharedModule {}
