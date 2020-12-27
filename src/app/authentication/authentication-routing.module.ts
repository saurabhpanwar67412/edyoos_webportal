import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from '../shared/auth.guard';
import { LoginGuard } from '../shared/login.guard';
import { EmailConfirmationComponent } from './emailconfirmation/email-confirmation.component';
import { ResetPasswordComponent } from './resetpassword/reset-password.component';
import { ContactComponent } from './contact/contact.component';
import { PartnershipComponent } from './partnership/partnership.component';
import { CityParkComponent } from '../landing/city-park/city-park.component';
import { AirportParkComponent } from '../landing/airport-park/airport-park.component';
import { TruckParkingComponent } from '../landing/truck-parking/truck-parking.component';
import { SemiTruckComponent } from '../landing/semi-truck/semi-truck.component';
import { BoatParkingComponent } from '../landing/boat-parking/boat-parking.component';
import { SeaPlaneComponent } from '../landing/sea-plane/sea-plane.component';
import { HelicopterComponent } from '../landing/helicopter/helicopter.component';
import { AfterConfirmationComponent } from './after-confirmation/after-confirmation.component';
import { RefundComponent } from './refund/refund.component';
import { WhoWeServeComponent } from './who-we-serve/who-we-serve.component';
import { WhatWeOfferComponent } from './what-we-offer/what-we-offer.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'register',
    component: SignupComponent
  },
  {
    path: 'emailconfirm',
    component: EmailConfirmationComponent
  },
  {
    path: 'forgetpassword',
    component: ForgetPasswordComponent
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'city-parking',
    component: CityParkComponent
  },
  {
    path: 'airport-parking',
    component: AirportParkComponent
  },
  {
    path: 'truck-parking',
    component: TruckParkingComponent
  },
  {
    path: 'semi-truck-parking',
    component: SemiTruckComponent
  },
  {
    path: 'boat-parking',
    component: BoatParkingComponent
  },
  {
    path: 'seaplane-parking',
    component: SeaPlaneComponent
  },
  {
    path: 'helicopter-parking',
    component: HelicopterComponent
  },
  {
    path: 'partnerships',
    component: PartnershipComponent
  },
  {
    path: 'refund',
    component: RefundComponent
  },
  {
    path: 'changepassword/:email',
    component: ChangePasswordComponent
  },
  {
    path: 'changepassword',
    component: ChangePasswordComponent
  },
  {
    path: 'afterconfirmation',
    component: AfterConfirmationComponent
  },
  {
    path:'who-we-serve',
    component:WhoWeServeComponent
  },
  {
    path:'what-we-offer',
    component:WhatWeOfferComponent
  }


  //  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  // { path: 'signup', component: SignupComponent },
  // { path: 'forget-password', component: ForgetPasswordComponent, canActivate: [LoginGuard] },
  // { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationtRoutingModule { }
