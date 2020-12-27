import { Component, OnInit } from '@angular/core';
import { NgWizardConfig, THEME, NgWizardService } from 'ng-wizard';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';

@Component({
  selector: 'app-cart-stepper',
  templateUrl: './cart-stepper.component.html',
  styleUrls: ['./cart-stepper.component.scss'],
})
export class CartStepperComponent implements OnInit {
  config: NgWizardConfig;
  checkoutPageTitle;
  formType;
  guestUserEmailAdress;
  guestBtnClick;

  constructor(protected ngWizardService: NgWizardService, private authenticationService: AuthenticationService) {
    this.config = {
      selected: 0,
      theme: THEME.arrows,
      toolbarSettings: {
        showNextButton: false,
        showPreviousButton: false,
        // toolbarExtraButtons: [
        //   {
        //     text: 'Finish',
        //     class: 'btn btn-info',
        //     event: () => {
        //       alert('Finished!!!');
        //     },
        //   },
        // ],
      },
      anchorSettings: {
        anchorClickable: false,
      },
    };

    this.checkoutPageTitle = 'Checkout as guest';

    if (this.authenticationService.userValue) {

      this.config.selected = 1;
      this.checkoutPageTitle = 'Checkout';
      this.formType = 'user';
    }

    // if (localStorage.getItem('userData')) {
    //   this.formType = 'user'
    //   this.config.selected = 1;
    //   this.checkoutPageTitle = 'Checkout';
    // }

  }

  ngOnInit(): void { }

  next(data) {
    this.formType = data.formType;
    this.guestUserEmailAdress = data.email;
    if (data.guestBtnClick) {
      this.guestBtnClick = true;
    }
     if (data.previous){
      this.ngWizardService.previous();
    }
    else{
      this.ngWizardService.next();
    }
    
  }
}
