import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MyOrdersComponent, CancelConfirmDialog } from './my-orders/my-orders.component';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';
import {DashboardComponent} from './dashboard.component'
import { DashboardRoutingModule } from './dashboard-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import { PaymentBillingComponent } from './payment/payment-billing/payment-billing.component';
import { PaymentEditComponent } from './payment/payment-edit/payment-edit.component';
import { PaymentComponent } from './payment/payment.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ProfilePageComponent } from '../profile/profile-page/profile-page.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { NgxBarcodeModule } from 'ngx-barcode';

@NgModule({
  declarations: [MyOrdersComponent, DashboardNavComponent,DashboardComponent, PaymentComponent,
        PaymentBillingComponent, PaymentEditComponent, CancelConfirmDialog, ProfilePageComponent, DashboardWrapperComponent],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSidenavModule,
    NgxBarcodeModule
  ],
  entryComponents: [
    PaymentEditComponent,
    CancelConfirmDialog
  ],
  providers: [],
})
export class DashboardModule { }
