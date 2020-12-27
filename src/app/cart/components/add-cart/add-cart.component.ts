import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CART_CHECKOUT_METADATA } from '../cart-checkout/cart_checkout_metadata';
import { PaymentService } from 'src/app/shared/payment.service';

@Component({
  selector: 'app-add-cart',
  templateUrl: './add-cart.component.html',
  styleUrls: ['./add-cart.component.scss']
})
export class AddCartComponent implements OnInit {

  paymentForm: FormGroup;
  @ViewChild('cardElement') cardElement: ElementRef;
  card: any;
  isValidCard: boolean;
  cardErrors: any;
  isValidCreditCard: boolean;
  stripe: any;
  CART_CHECKOUT_METADATA = CART_CHECKOUT_METADATA;
  constructor(private formBuilder: FormBuilder,
    // tslint:disable-next-line:align
    private paymentService: PaymentService,

  ) { }

  ngOnInit() {
    this.createGuestForm();
    // this.getPublishableKey();
    // this.addStripeElement();
  }
  createGuestForm() {
    this.paymentForm = this.formBuilder.group({
      [CART_CHECKOUT_METADATA.cardName]: ['', Validators.required],
      [CART_CHECKOUT_METADATA.vehicleInfo]: this.formBuilder.group({
        [CART_CHECKOUT_METADATA.licenseNumber]: ['', [Validators.required, Validators.maxLength(50)]],
        [CART_CHECKOUT_METADATA.vehicleMake]: ['', [Validators.required, Validators.maxLength(100)]],
        [CART_CHECKOUT_METADATA.vehicleModel]: ['', [Validators.required, Validators.maxLength(50)]],
        // [CART_CHECKOUT_METADATA.vehicleColor]: ['', Validators.required]
      }),
    });
  }
  getPublishableKey() {
    this.paymentService.getPublishableKey()
      .subscribe((response) => {
        this.stripe = Stripe(response.data.publishableKey);
      });
  }
  addStripeElement() {
    const elements =  this.stripe && this.stripe.elements();

    this.card = elements && elements.create('card', {
      classes: {
        base: 'form-control'
      }
    });

    this.card.mount(this.cardElement.nativeElement);
    this.card.addEventListener('change', (event) => {
      this.isValidCard = !event.complete;
      this.isValidCreditCard = event.complete;
      this.cardErrors = event.error ? event.error.message : null;
    });

  }
}
