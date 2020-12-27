import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartConfirmationComponent } from './components/cart-confirmation/cart-confirmation.component';
import { CartStepperComponent } from './components/cart-stepper/cart-stepper.component';

const routes: Routes = [
  {
    path: '', component: CartStepperComponent
  },
  {
    path: 'order-placed/:id', component: CartConfirmationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule { }
