
import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RegisterService } from '../../shared/authentication/register/register.service';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { UserRegister } from 'src/app/model/register/register.model';
import swal from 'sweetalert2';
import { ErrorModel } from 'src/app/model/login/error.model';
import { CustomValidators } from 'src/app/helper/custom-validators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { Cart } from 'src/app/model/cart/cart.model';
import { PlacesService } from 'src/app/shared/places.service';
import { CartService } from 'src/app/shared/cart.service';
import jwt_decode from 'jwt-decode';

declare var $: any;
declare var window: any;
declare var FB: any;
declare var auth2: any;
declare var AppleID: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  httpError: any;

  constructor(private fb: FormBuilder, public router: Router, private registerService: RegisterService
    , private authenticationService: AuthenticationService, private placesService: PlacesService
    , private cartService: CartService, public zone: NgZone) { }

  ngOnInit() {

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email
        //  Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
      ]],
      passwordGroup: this.fb.group({
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true
              }
            ),
            Validators.minLength(8)
          ])
        ],
        passwordConfirmation: ['', Validators.required]
      }, { validator: CustomValidators.matchPassword }),
      iAgree: [false, Validators.requiredTrue],
      subscribeNewsLetter: [false]

    });

    this.registerForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.registerForm);
    })

  }

  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    passwordGroup: '',
    iAgree: '',
    subscribeNewsLetter: ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    firstName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 2 characters.',
      maxlength: 'Full Name must be less than 20 characters.'
    },
    lastName: {
      required: 'LastName is required.',
      maxlength: 'Last Name must be less than 20 characters.'
    },
    email: {
      required: 'Email is required!',
      email: 'Enter a valid email address!'
    },
    password: {
      required: "Password is required",
      minlength: "Must be at least 8 characters!",
      hasNumber: "Must contain at least 1 number!",
      hasCapitalCase: "Must contain at least 1 in Capital Case!",
      hasSmallCase: "Must contain at least 1 Letter in Small Case!",
      hasSpecialCharacters: "Must contain at least 1 Special Character!"
    },
    passwordConfirmation: {
      required: 'Confirm Password  is required.',
      passwordMismatch: 'Password and Confirm Password do not match.'
    },
    passwordGroup: {
      passwordMismatch: 'Password and Confirm Password do not match.'
    },
    iAgree: {
      required: 'I agree is required.'
    },
    subscribeNewsLetter: {
      required: 'Subscribe to news letter is required.'
    }
  };
  //google login

  googleLogin() {
    auth2.grantOfflineAccess()
      .then((result) => this.signInCallback(result));

    // auth2.signIn().then((result) => this.signInCallback(result));
  }

  signInCallback(authResult) {

    var params = {
      Code: authResult.code,
      ReturnUrl: window.location.origin,
      GrantType: "authorization_code"
    }

    this.authenticationService.externalGoogleLogin(params).subscribe((response) => {

      this.setlocalStorageAndGetCartDetails(response);

    }, (error) => {
      console.log(error);
    })
  }

  //FB login

  facebookLogin() {
    FB.login((response) => {
      this.statusChangeCallback(response);
    }, { scope: 'public_profile,email' });
  }
  statusChangeCallback(response) {
    if (response.status === 'connected') {

      this.externalLogin(response.authResponse.accessToken);
    }
  }
  externalLogin(accessToken: string) {
    this.authenticationService.externalFacebookLogin(accessToken).subscribe((response) => {
      this.setlocalStorageAndGetCartDetails(response);

    }, (error) => {
      console.log(error);

    })
  }

  getCartDetails() {
    this.cartService.getCartDetails().subscribe((response) => {
      this.placesService.cartPropertyGroup = response.data;
      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
    }, (error) => {
      console.log(error);

    })
  }

  async appleLogin() {
    try {
      const data = await AppleID.auth.signIn();
      // console.log(data);
      const jsonPayload: any = jwt_decode(data.authorization.id_token);
      // console.log(jsonPayload.sub);

      let appleRequest = {
        UserId: jsonPayload.sub,
        Email: null,
        FirstName: null,
        LastName: null
      };
      if (data.user) {
        appleRequest.Email = data.user.email;
        appleRequest.FirstName = data.user.name.firstName;
        appleRequest.LastName = data.user.name.lastName;
      }
      this.appleExternalLogin(appleRequest);
      //   const jsonHeader:any=  jwt_decode(data.authorization.id_token,{ header: true });
      //     console.log(jsonHeader.kid);

    } catch (error) {
      console.log(error);
    }
  }

  appleExternalLogin(appleRequest) {

    this.authenticationService.appleExternalLogin(appleRequest).subscribe((response) => {
      this.setlocalStorageAndGetCartDetails(response);

    }, (error) => {
      console.log(error);
    })
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
        console.log(response.data);

        this.getCartDetails();

        this.zone.run(() => {
          this.router.navigate(['landing/home']);
        });

      }, (error) => {
        console.log(error);

      })
    }
    else {
      this.getCartDetails();
      this.zone.run(() => {
        this.router.navigate(['landing/home']);
      });
    }
  }


  logValidationErrors(group: FormGroup = this.registerForm): void {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (abstractControl && !abstractControl.valid && abstractControl.touched) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            if (this.formErrors[key] == '')
              this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }
  openPrivacyNewWindow() {
    window.open('#/privacy',
      '_blank',
      'width=500,height=500,top=' + 0 + ', left=' + 0);
  }
  openTermsNewWindow() {
    window.open('#/terms-and-conditions',
      '_blank',
      'width=500,height=500,top=' + 0 + ', left=' + 0);
  }


  public get getPasswordControl() {
    return this.registerForm.get('passwordGroup').get('password');
  }
  marksAsTouched() {
    this.registerForm.get('iAgree').markAsTouched();
  }

  showSwal(text) {
    swal({
      title: "Registration Successful",
      text: text,
      buttonsStyling: false,
      confirmButtonClass: "btn btn-fill btn-success",
      type: "success"

    }).then((result) => {
      if (result.value) {
        this.router.navigate(['pages/login']);
      }
      else {
        this.router.navigate(['pages/login']);
      }
    });
  }
  submitBtnClicked: boolean = false;
  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.logValidationErrors(this.registerForm)

    }
    else {
      this.submitBtnClicked = true;
      let registerUser = new UserRegister();
      registerUser.FirstName = this.registerForm.get('firstName').value;
      registerUser.LastName = this.registerForm.get('lastName').value;
      registerUser.Email = this.registerForm.get('email').value;
      registerUser.Password = this.registerForm.get('passwordGroup').get('password').value;
      registerUser.SubscribeToNewsLetter = this.registerForm.get('subscribeNewsLetter').value;
      registerUser.IAgree = this.registerForm.get('iAgree').value;
      registerUser.ReturnUrl = `${window.location.origin}/#/pages/emailconfirm`;
      registerUser.FromClient = true;
      this.registerService.RegisterUser(registerUser).subscribe((response: ApiResponse<string>) => {

        if (response.data) {
          this.showSwal(response.data);
        }

      }, (error) => {
        this.submitBtnClicked = false;
        this.httpError = error;

      });
    }

  }
}

