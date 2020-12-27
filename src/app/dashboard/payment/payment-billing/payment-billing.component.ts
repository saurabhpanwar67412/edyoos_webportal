import { Component, OnInit, Inject, ElementRef, NgZone, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/shared/payment.service';
import { UpdatePaymentRequest } from 'src/app/model/payment/update_payment_request.model';
import { ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-payment-billing',
  templateUrl: './payment-billing.component.html',
  styleUrls: ['./payment-billing.component.scss']
})
export class PaymentBillingComponent implements OnInit {

  billlingDetailsForm: FormGroup;

  @ViewChild('searchBar')
  public searchElementRef: ElementRef;
  @Output() cancelAddress = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    protected mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public dialog: MatDialog, public dialogRef: MatDialogRef<PaymentBillingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private paymentService: PaymentService) {
  }

  ngOnInit(): void {

    this.billlingDetailsForm = this.fb.group({
      // expMonth: [this.data.cardUpdate.expMonth, [Validators.required]],
      // expYear: [this.data.cardUpdate.expYear, [Validators.required]],
      // cardHolderName: [this.data.billingDetailsUpdate.name, [Validators.required]],

      email: [this.data.billingDetailsUpdate.email, [Validators.email]],
      phone: [this.data.billingDetailsUpdate.phone],

      city: [this.data.billingDetailsUpdate.addressUpdate.city],
      country: [this.data.billingDetailsUpdate.addressUpdate.country],
      line1: [this.data.billingDetailsUpdate.addressUpdate.line1],
      line2: [this.data.billingDetailsUpdate.addressUpdate.line2],
      postalCode: [this.data.billingDetailsUpdate.addressUpdate.postalCode, [Validators.required]],
      state: [this.data.billingDetailsUpdate.addressUpdate.state]
    });
  }


  OnSubmitClick(value: boolean): void {
    this.dialogRef.close(value);
  }

  updateBillingDetails() {

    const updatePaymentRequest = new UpdatePaymentRequest();
    updatePaymentRequest.PaymentId = this.data.id;
    updatePaymentRequest.CardUpdate.ExpMonth = this.data.cardUpdate.expMonth;
    updatePaymentRequest.CardUpdate.ExpYear = this.data.cardUpdate.expYear;
    updatePaymentRequest.BillingDetailsUpdate.Name = this.data.billingDetailsUpdate.name;

    updatePaymentRequest.BillingDetailsUpdate.Email = this.billlingDetailsForm.get('email').value;
    updatePaymentRequest.BillingDetailsUpdate.Phone = this.billlingDetailsForm.get('phone').value;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.City = this.billlingDetailsForm.get('city').value;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.Country = this.billlingDetailsForm.get('country').value;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.Line1 = this.billlingDetailsForm.get('line1').value;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.Line2 = this.billlingDetailsForm.get('line2').value;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.PostalCode = this.billlingDetailsForm.get('postalCode').value;
    updatePaymentRequest.BillingDetailsUpdate.AddressUpdate.State = this.billlingDetailsForm.get('state').value;


    this.paymentService.updatePaymentDetails(updatePaymentRequest)
      .subscribe((response) => {
        // this.OnSubmitClick(true);
        this.cancelAddress.emit(true);
      }, (error) => {
        console.log(error);
      })

  }
  closeDialog() {
    // this.dialog.closeAll();
    this.cancelAddress.emit(false);
  }
  ngAfterViewInit() {
    this.initializeAutoComplete();
  }
  geoCoder;
  initializeAutoComplete() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place);
        });
      });
    });
  }
}
