import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { WhyUsComponent } from './why-us/why-us.component';
import { PricingComponent } from './pricing/pricing.component';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { WhyEdyoosComponent } from './why-Edyoos/why-Edyoos.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    LandingComponent,
    WhyUsComponent,
    PricingComponent,
    MainComponent,
    AboutUsComponent,
    WhyEdyoosComponent
  ],
  imports: [SharedModule, LandingRoutingModule, RouterModule],
})
export class LandingModule {}
