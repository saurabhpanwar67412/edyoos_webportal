import { NgModule } from '@angular/core';

import { CartRoutingModule } from './cart-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStepperComponent } from './components/cart-stepper/cart-stepper.component';
import { CartInformationComponent } from './components/cart-information/cart-information.component';
import { CartConfirmationComponent } from './components/cart-confirmation/cart-confirmation.component';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { CartCheckoutComponent } from './components/cart-checkout/cart-checkout.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AddCartComponent } from './components/add-cart/add-cart.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { ShareModalComponent } from '../details/share-modal/share-modal.component';
import { ReadMoreComponent } from '../shared/read-more/read-more.component';
import { DateValidationComponent } from './date-validation-dialog/date-validation.component';
import { NgxBarcodeModule } from 'ngx-barcode';

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.circles,
};

@NgModule({
  declarations: [
    CartStepperComponent,
    CartInformationComponent,
    CartConfirmationComponent,
    CartCheckoutComponent,
    OrdersComponent,
    AddCartComponent,
    ReadMoreComponent,
    DateValidationComponent
  ],
  imports: [
    CartRoutingModule,
    DpDatePickerModule,
    SharedModule,
    NgxBarcodeModule,
    // NgbModule,
    NgWizardModule.forRoot(ngWizardConfig),
  ],
  entryComponents: [ShareModalComponent, AddCartComponent,DateValidationComponent],
  providers: [],
})
export class CartModule { }
