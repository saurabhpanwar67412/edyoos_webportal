import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AuthGuard } from '../shared/auth.guard';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';
import { PaymentComponent } from './payment/payment.component';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardWrapperComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: DashboardNavComponent,
      },
      {
        path: 'myorders',
        component: MyOrdersComponent,
      },
      {
        path: 'payment',
        component: PaymentComponent,
      },
      {
        path: '',
        redirectTo: 'user/dashboard/home',
        pathMatch: 'full'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
