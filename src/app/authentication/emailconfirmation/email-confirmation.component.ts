import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { EmailConfirm } from 'src/app/model/emailconfirm/emailconfirm.model';
import { RegisterService } from '../../shared/authentication/register/register.service';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import swal from 'sweetalert2';
import { ErrorModel } from 'src/app/model/login/error.model';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { Cart } from 'src/app/model/cart/cart.model';
import { PlacesService } from 'src/app/shared/places.service';
import { CartService } from 'src/app/shared/cart.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  confirmEmailForm: FormGroup;
  submitted: boolean = false;
  httpError: string;
  emailConfirm: EmailConfirm = new EmailConfirm();
  submitBtnDisable: boolean = false;


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private placesService: PlacesService,
    private authenticationService: AuthenticationService, private cartService: CartService,
    private router: Router, private registerService: RegisterService) { }

  ngOnInit(): void {

    this.confirmEmailForm = this.fb.group({
      password: ['', [Validators.required
      ]]
    });

    this.route.queryParams.subscribe(params => {
      this.emailConfirm.Email = params['email'];

      if (params['userid'])
        this.emailConfirm.UserId = params['userid'];
      else if (params['userId'])
        this.emailConfirm.UserId = params['userId'];

      this.emailConfirm.Token = params['token'];
    });

    this.confirmEmailForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.confirmEmailForm);
    })

  }

  formErrors = {
    password: ''
  };

  validationMessages = {
    password: {
      required: 'Password is required.'

    }

  };
  showSwal(type) {
    if (type == 'success-message') {
      swal({
        title: "Email has been confirmed!",
        text: "You clicked the button!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "success"

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['landing/home']);
        }
        else {
          this.router.navigate(['landing/home']);
        }
      });

    }
  }

  logValidationErrors(group: FormGroup = this.confirmEmailForm): void {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (abstractControl && !abstractControl.valid) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  setlocalStorageAndGetCartDetails(response) {
    this.authenticationService.setUserValue(response.data);

    let cart: Cart[] = [];

    if (this.placesService.cartPropertyGroup.length > 0) {

      this.placesService.cartPropertyGroup.forEach((val, index) => {
        let cartDetails = new Cart();
        val.PropertyGroupID = cartDetails.PropertyGroupID;
        cart.push(cartDetails);
      });
      this.cartService.addCart(cart).subscribe((response) => {
        this.getCartDetails();

      }, (error) => {
        console.log(error);

      })
    }
    else {
      this.getCartDetails();
    }
  }
  getCartDetails() {
    this.cartService.getCartDetails().subscribe((response) => {
      this.placesService.cartPropertyGroup = response.data;
      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
      // this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

    }, (error) => {
      console.log(error);

    })
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.confirmEmailForm.invalid) {
      this.logValidationErrors(this.confirmEmailForm)
    }
    else {
      this.submitBtnDisable = true;
      this.emailConfirm.Password = this.confirmEmailForm.get('password').value;
      this.registerService.EmailConfirmation(this.emailConfirm).subscribe((response: any) => {
        this.submitBtnDisable = false;
        this.setlocalStorageAndGetCartDetails(response);
        this.showSwal('success-message');
      }, (error) => {
        this.submitBtnDisable = false;
        this.httpError = error;
      })

    }
  }
}
