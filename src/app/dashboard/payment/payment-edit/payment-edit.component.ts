
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from '../../../shared/payment.service';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UpdatePaymentRequest } from 'src/app/model/payment/update_payment_request.model';
import { PaymentBillingComponent } from '../payment-billing/payment-billing.component';

interface Month {
  Text: number;
  Value: number;
}
interface Year {
  Text: number;
  Value: number;
}

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.scss']
})
export class PaymentEditComponent {

  constructor(private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<PaymentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private paymentService: PaymentService) {
  }
  billlingDetailsForm: FormGroup;
  isPaymentAddressChange = false;
  spinner = false;



  months: Month[] = [];
  years: Year[] = [];

  ngOnInit(): void {
    console.log(this.data);
    this.getYear();
    this.getMonth();

    this.billlingDetailsForm = this.fb.group({
      expMonth: [this.data.cardUpdate.expMonth, [Validators.required]],
      expYear: [this.data.cardUpdate.expYear, [Validators.required]],
      cardHolderName: [this.data.billingDetailsUpdate.name, [Validators.required]],

      // email: [this.data.billingDetailsUpdate.email, [Validators.email]],
      // phone: [this.data.billingDetailsUpdate.phone],

      // city: [this.data.billingDetailsUpdate.addressUpdate.city],
      // country: [this.data.billingDetailsUpdate.addressUpdate.country],
      // line1: [this.data.billingDetailsUpdate.addressUpdate.line1],
      // line2: [this.data.billingDetailsUpdate.addressUpdate.line2],
      // postalCode: [this.data.billingDetailsUpdate.addressUpdate.postalCode, [Validators.required]],
      // state: [this.data.billingDetailsUpdate.addressUpdate.state]
    });
  }

  addRessChange() {
    this.spinner = true;
    setTimeout(() => {
      this.isPaymentAddressChange = true;
      this.spinner = false;
    }, 1000);
  }
  cancelAddRessChange(event) {
    if(event){
      this.dialogRef.close(event);
    }
    this.spinner = true;
    setTimeout(() => {
      this.isPaymentAddressChange = false;
      this.spinner = false;
    }, 1000);
  }

  getMonth() {
    for (let i = 1; i <= 12; i++) {
      this.months.push({ Text: i, Value: i });
    }
  }

  getYear() {
    let currentYear = new Date().getFullYear();
    let addfutureYear = currentYear + 20;

    for (currentYear; currentYear <= addfutureYear; currentYear++) {
      this.years.push({ Text: currentYear, Value: currentYear });
    }
  }

  OnSubmitClick(value: boolean): void {
    this.dialogRef.close(value);
  }

  updateBillingDetails() {

    let updatePaymentRequest = new UpdatePaymentRequest();
    updatePaymentRequest.PaymentId = this.data.id;
    updatePaymentRequest.BillingDetailsUpdate.Name = this.billlingDetailsForm.get('cardHolderName').value;
    updatePaymentRequest.CardUpdate.ExpMonth = +this.billlingDetailsForm.get('expMonth').value;
    updatePaymentRequest.CardUpdate.ExpYear = +this.billlingDetailsForm.get('expYear').value;

    updatePaymentRequest.BillingDetailsUpdate.Email = this.data.billingDetailsUpdate.email;
    updatePaymentRequest.BillingDetailsUpdate.Phone = this.data.billingDetailsUpdate.phone;

    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.City = this.data.billingDetailsUpdate.addressUpdate.city;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.Country = this.data.billingDetailsUpdate.addressUpdate.country;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.Line1 = this.data.billingDetailsUpdate.addressUpdate.line1;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.Line2 = this.data.billingDetailsUpdate.addressUpdate.line2;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.PostalCode = this.data.billingDetailsUpdate.addressUpdate.postalCode;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.State = this.data.billingDetailsUpdate.addressUpdate.state;


    this.paymentService.updatePaymentDetails(updatePaymentRequest)
      .subscribe((response) => {
        console.log(response);
        this.OnSubmitClick(true);
      }, (error) => {
        console.log(error);

      })

  }
  public getImage(type: string): string {
    let url = './assets/images/credit-card.png';
    switch (type && type.toLowerCase()) {
      case 'visa':
        url = './assets/images/VISA.png';
        break;
      case 'mastercard':
        url = './assets/images/mastercard.png';
        break;
      case 'amex':
        url = './assets/images/amex.png';
        break;
      case 'jcb':
        url = './assets/images/jcb.png';
        break;
      default:
      // code block
    }
    return url;
  }
}
