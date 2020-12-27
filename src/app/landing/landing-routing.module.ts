import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';

import { LandingComponent } from './landing.component';
import { WhyEdyoosComponent } from './why-Edyoos/why-Edyoos.component';
import { WhyUsComponent } from './why-us/why-us.component';

const routes: Routes = [{
  path: '', component: LandingComponent,
  children: [
    {
      path: 'home',
      component: WhyUsComponent
    },
    {
      path: 'about',
      component: AboutUsComponent
    },
    {
      path: 'why-Edyoos',
      component: WhyEdyoosComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
