import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpRaterComponent } from './sign-up/sign-up-rater/sign-up-rater.component';
import { SignUpProviderComponent } from './sign-up/sign-up-provider/sign-up-provider.component';
import { SignUpProviderStepOneComponent } from './sign-up/sign-up-provider/sign-up-provider-step-one/sign-up-provider-step-one.component';
import { SignUpProviderStepTwoComponent } from './sign-up/sign-up-provider/sign-up-provider-step-two/sign-up-provider-step-two.component';
import { SignUpProviderStepThreeComponent } from './sign-up/sign-up-provider/sign-up-provider-step-three/sign-up-provider-step-three.component';
import { SharedModule } from '../../shared/shared.module';

export const routes: Routes = [
  { path: '', redirectTo: 'step-one', pathMatch: 'full' },
  { path: 'step-one', component: SignUpProviderStepOneComponent },
  { path: 'step-two', component: SignUpProviderStepTwoComponent },
  { path: 'step-three', component: SignUpProviderStepThreeComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignUpComponent,
    SignUpRaterComponent,
    SignUpProviderComponent,
    SignUpProviderStepOneComponent,
    SignUpProviderStepTwoComponent,
    SignUpProviderStepThreeComponent
  ]
})
export class AuthModule { }
