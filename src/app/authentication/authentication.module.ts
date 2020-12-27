import { NgModule } from '@angular/core';

import { AuthenticationtRoutingModule } from './authentication-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
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
import { WhatWeOfferComponent } from './what-we-offer/what-we-offer.component';
import { WhoWeServeComponent } from './who-we-serve/who-we-serve.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    EmailConfirmationComponent,
    ResetPasswordComponent,
    ContactComponent,
    PartnershipComponent,
    CityParkComponent,
    AirportParkComponent,
    TruckParkingComponent,
    SemiTruckComponent,
    BoatParkingComponent,
    SeaPlaneComponent,
    HelicopterComponent,
    AfterConfirmationComponent,
    RefundComponent,
    WhatWeOfferComponent,
    WhoWeServeComponent
  ],
  imports: [
    AuthenticationtRoutingModule,
    SharedModule,
  ],
  providers: [],
})
export class AuthenticationModule { }
