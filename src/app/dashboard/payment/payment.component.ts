import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { DASHBOARD_TABS_METADATA } from '../dashboard_metadata';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/shared/payment.service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { CardSetupRequest } from 'src/app/model/payment/card_setup_request.model';
import { AttachPaymentRequest } from 'src/app/model/payment/attach_payment_request.model';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';

declare var Stripe: stripe.StripeStatic

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  DASHBOARD_TABS_METADATA = DASHBOARD_TABS_METADATA;

  stripe;
  card;
  exp;
  cvc;
  cardErrors;
  isOpen = false;

  addNewCard: boolean = false;

  constructor(private fb: FormBuilder, private paymentService: PaymentService,
    private authenticationService: AuthenticationService, public dialog: MatDialog,
    private dialogService: ConfirmDialogService) { }


  ngOnInit(): void {
    this.getPublishableKey();

    this.paymentForm = this.fb.group({
      cardName: ['', [Validators.required]]

    });


    this.getPaymentDetails();
  }

  getPublishableKey() {
    this.paymentService.getPublishableKey()
      .subscribe((response) => {
        this.stripe = Stripe(response.data.publishableKey);
        this.addStripeElement();
      });

  }

  step = -1;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  @ViewChild('cardElement') cardElement: ElementRef;
  isValidCard: boolean = true;
  paymentForm: FormGroup;


  ngAfterViewInit(): void {
    // this.addStripeElement();
  }

  addNewCardBtn() {
    this.addNewCard = !this.addNewCard;
  }

  addStripeElement() {
    const elements = this.stripe.elements();

    this.card = elements.create('card', {
      classes: {
        base: "form-control",
      }
    });


    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', (event) => {
      this.isValidCard = !event.complete;
      this.cardErrors = event.error ? event.error.message : null;

    });

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
  openDialog(index: number) {
    const data = this.listOfCardDetails[index];
    const dialogRef = this.dialog.open(PaymentEditComponent,
      {
        data: data,
        disableClose: true,
        width: '900px'
      });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getPaymentDetails();
      }
    });
  }


  addCardSetup() {

    let userDetails = this.authenticationService.userValue;

    let cardName = this.paymentForm.get('cardName').value;

    let cardIntent = new CardSetupRequest();
    cardIntent.Email = userDetails.email;
    cardIntent.UserName = userDetails.username;

    this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: {
        name: cardName
      },
    }
    ).then((result) => {
      if (result.error) {
        // Display error.message in your UI
        console.log(result.error.message);
      } else {
        // You have successfully created a new PaymentMethod
        console.log(result.paymentMethod.id);

        const attachPaymentRequest = new AttachPaymentRequest();
        attachPaymentRequest.UserName = userDetails.username;
        attachPaymentRequest.PaymentId = result.paymentMethod.id;
        attachPaymentRequest.Email = userDetails.email;

        this.paymentService.saveCardDetails(attachPaymentRequest)
          .subscribe((response) => {
            console.log(response.data);
            this.addNewCard = false;
            this.card.clear();
            this.paymentForm.get('cardName').setValue(null);
            this.getPaymentDetails();


          }, (error) => {
            console.log(error);

          })

      }
    });

  }



  listOfCardDetails: any[] = [];

  getPaymentDetails() {
    this.paymentService.GetPaymentMethodsById()
      .subscribe((response) => {
        this.listOfCardDetails = response.data;
        console.log(response.data);

      }, (error) => {
        console.log(error);

      });
  }

  removeCardDetails(cardId: number) {

    const options = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete this card!',
      confirmText: 'Yes',
      cancelText: 'No'
    };

    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.deletePaymentCard(cardId);
      }
    });


  }

  deletePaymentCard(cardId: number) {
    this.paymentService.deletePaymentCardDetails(cardId)
      .subscribe((response) => {
        console.log(response.data);
        this.getPaymentDetails();
      }, (error) => {
        console.log(error);

      })
  }


}
