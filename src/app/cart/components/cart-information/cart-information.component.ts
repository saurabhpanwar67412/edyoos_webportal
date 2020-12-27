import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CartStepperComponent } from '../cart-stepper/cart-stepper.component';
import { NgWizardService } from 'ng-wizard';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RegisterService } from 'src/app/shared/authentication/register/register.service';
import { CustomValidators } from 'src/app/helper/custom-validators';
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserLogin } from 'src/app/model/login/login.model';
import { LoginService } from 'src/app/shared/authentication/login/login.service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { User } from 'src/app/model/login/user.model';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { CartService } from 'src/app/shared/cart.service';
import { PlacesService } from 'src/app/shared/places.service';
import { Cart } from 'src/app/model/cart/cart.model';
import { AvailableSpotsRequest } from 'src/app/model/Booking/available_spots.model';
import { CART_INFORMATION_METADATA } from './cart_information_metadata';
import { FeeType } from 'src/app/shared/enum/feetype.enum';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from 'src/app/authentication/signup/signup.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRegister } from 'src/app/model/register/register.model';
import { PricingType, PricingTypeText } from 'src/app/shared/enum/pricing_type_enum';

declare var jQuery:any;
@Component({
  selector: 'app-cart-information',
  templateUrl: './cart-information.component.html',
  styleUrls: ['./cart-information.component.scss'],
})
export class CartInformationComponent implements OnInit {
  @Output() next = new EventEmitter<any>();
  loginForm: FormGroup;
  registerForm:FormGroup;
  
  CART_INFORMATION_METADATA = CART_INFORMATION_METADATA;
  selectedTabIndex: number=1;
  pricingType: any;
  pricingTypeText: any;

  googleProviderUrl: string = `${environment.apiURL}/Account/ExternalLogin?provider=google&returnUrl=${window.location.origin}`;
  httpError: any;
  config = {
    format: 'YYYY-MM-DD hh:mm:ss a',
    minutesInterval: 15,
    min: moment(),
    weekDayFormat: 'dd',
  };
  fromMinDate = moment();
  public changeDate = false;
  public fromDate;
  public toDate;
  closeResult: string;
  hidediv: boolean=false;
  submitBtnClicked: boolean = false;
  constructor(
    private modalService: NgbModal,
    private cookieService: CookieService,
    private fb: FormBuilder, public router: Router,
    private loginService: LoginService, private authenticationService: AuthenticationService,
    private cartService: CartService,
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private registerService: RegisterService
  ) { }

  reserveNow: boolean = false;
  public isGuestUser = false;
  public isGuestUserClicked = false;
  public guestUserEmail: string;
  userName: string;
  public spotDetails: AvailableSpotsRequest;
  bookedPlaces: any[];
  total = 0;

  ngOnInit(): void {
    this.init();
    jQuery('#datetimepicker').datetimepicker({
      minDate:new Date(),
      format:'Y-m-d h:i:s A',
      formatTime:"h:i A",
      step:60,
      allowTimes:[
        '00:00','00:15', '00:30', '00:45','01:00', 
        '01:15', '01:30', '01:45','02:00', 
        '02:15', '02:30', '02:45','03:00', 
        '03:15', '03:30', '03:45','04:00',
        '04:15', '04:30', '04:45','05:00', 
        '05:15', '05:30', '05:45','06:00',
        '06:15', '06:30', '06:45','07:00', 
        '07:15', '07:30', '07:45','08:00',
        '08:15', '08:30', '08:45','09:00', 
        '09:15', '09:30', '09:45','10:00',
        '10:15', '10:30', '10:45','11:00', 
        '11:15', '11:30', '11:45','12:00',
        '12:15', '12:30', '12:45','13:00', 
        '13:15', '13:30', '13:45','14:00',
        '14:15', '14:30', '14:45','15:00', 
        '15:15', '15:30', '15:45','16:00',
        '16:15', '16:30', '16:45','17:00', 
        '17:15', '17:30', '17:45','18:00',
        '18:15', '18:30', '18:45','19:00', 
        '19:15', '19:30', '19:45','20:00',
        '20:15', '20:30', '20:45','21:00', 
        '21:15', '21:30', '21:45','22:00',
        '22:15', '22:30', '22:45','23:00', 
        '23:15', '23:30', '23:45'
       ] ,
       onSelectTime:function( ct ){
        jQuery('#todatetimepicker').datetimepicker('hide');
        jQuery('#datetimepicker').datetimepicker('hide');
       jQuery('#todatetimepicker').datetimepicker('show');
       var today=new Date(jQuery('#datetimepicker').val());
       today.setHours(today.getHours() + 1);
       jQuery('#todatetimepicker').val(today);
      },
      onChangeDateTime:function( ct ){
       debugger;
       var today=new Date(ct);
       today.setHours(today.getHours() + 1);
       jQuery('#todatetimepicker').datetimepicker({minDate:ct,format:'Y-m-d h:i:s A',
       value:today,
      formatTime:"h:i A",
      step:60,
       allowTimes:[
        '00:00','00:15', '00:30', '00:45','01:00', 
        '01:15', '01:30', '01:45','02:00', 
        '02:15', '02:30', '02:45','03:00', 
        '03:15', '03:30', '03:45','04:00',
        '04:15', '04:30', '04:45','05:00', 
        '05:15', '05:30', '05:45','06:00',
        '06:15', '06:30', '06:45','07:00', 
        '07:15', '07:30', '07:45','08:00',
        '08:15', '08:30', '08:45','09:00', 
        '09:15', '09:30', '09:45','10:00',
        '10:15', '10:30', '10:45','11:00', 
        '11:15', '11:30', '11:45','12:00',
        '12:15', '12:30', '12:45','13:00', 
        '13:15', '13:30', '13:45','14:00',
        '14:15', '14:30', '14:45','15:00', 
        '15:15', '15:30', '15:45','16:00',
        '16:15', '16:30', '16:45','17:00', 
        '17:15', '17:30', '17:45','18:00',
        '18:15', '18:30', '18:45','19:00', 
        '19:15', '19:30', '19:45','20:00',
        '20:15', '20:30', '20:45','21:00', 
        '21:15', '21:30', '21:45','22:00',
        '22:15', '22:30', '22:45','23:00', 
        '23:15', '23:30', '23:45'
       ],
       onSelectTime:function( ct ){
       
        }
      });
       
       }
       
       
  });
  }
  formloginErrors = {
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
  validationLoginMessages = {
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

  init() {
   this.pricingType = PricingType;
   this.pricingTypeText = PricingTypeText;
 if (isNaN(this.selectedTabIndex) || this.selectedTabIndex < 0) {
    this.selectedTabIndex = 0;
  }
    this.bookedPlaces = this.placesService.cartPropertyGroup;
    this.placesService.addedCartPropertyGroup.subscribe((value: any[]) => {
            this.bookedPlaces = value;
            this.calculateTotal();
          });
    this.bookedPlaces.forEach((o) => {
      // o.checkoutAmount=o.calculatedAmount;
      o.changeDateClick = false;
      o.isDateRangeValid = true;
      o.changeSearchFromDateTime = moment(o.searchFromDateTime).format("YYYY-MM-DD hh:mm:ss A");
      o.changesearchToDateTime = moment(o.searchToDateTime).format("YYYY-MM-DD hh:mm:ss A");

      o.searchFromDateTime = moment(o.searchFromDateTime);
      o.searchToDateTime = moment(o.searchToDateTime);
      // o.isSpotAvaliable = true;
      jQuery('#datetimepicker').datetimepicker({
        minDate:new Date(),
        format:'Y-m-d h:i:s A',
        formatTime:"h:i A",
        step:60,
        allowTimes:[
          '00:00','00:15', '00:30', '00:45','01:00', 
          '01:15', '01:30', '01:45','02:00', 
          '02:15', '02:30', '02:45','03:00', 
          '03:15', '03:30', '03:45','04:00',
          '04:15', '04:30', '04:45','05:00', 
          '05:15', '05:30', '05:45','06:00',
          '06:15', '06:30', '06:45','07:00', 
          '07:15', '07:30', '07:45','08:00',
          '08:15', '08:30', '08:45','09:00', 
          '09:15', '09:30', '09:45','10:00',
          '10:15', '10:30', '10:45','11:00', 
          '11:15', '11:30', '11:45','12:00',
          '12:15', '12:30', '12:45','13:00', 
          '13:15', '13:30', '13:45','14:00',
          '14:15', '14:30', '14:45','15:00', 
          '15:15', '15:30', '15:45','16:00',
          '16:15', '16:30', '16:45','17:00', 
          '17:15', '17:30', '17:45','18:00',
          '18:15', '18:30', '18:45','19:00', 
          '19:15', '19:30', '19:45','20:00',
          '20:15', '20:30', '20:45','21:00', 
          '21:15', '21:30', '21:45','22:00',
          '22:15', '22:30', '22:45','23:00', 
          '23:15', '23:30', '23:45'
         ] ,
         onSelectTime:function( ct ){
          jQuery('#todatetimepicker').datetimepicker('hide');
          jQuery('#datetimepicker').datetimepicker('hide');
         jQuery('#todatetimepicker').datetimepicker('show');
         var today=new Date(jQuery('#datetimepicker').val());
         today.setHours(today.getHours() + 1);
         jQuery('#todatetimepicker').val(today);
        },
        onChangeDateTime:function( ct ){
         debugger;
         var today=new Date(ct);
         today.setHours(today.getHours() + 1);
         jQuery('#todatetimepicker').datetimepicker({minDate:ct,format:'Y-m-d h:i:s A',
         value:today,
         formatTime:"h:i A",
         step:60,
         allowTimes:[
          '00:00','00:15', '00:30', '00:45','01:00', 
          '01:15', '01:30', '01:45','02:00', 
          '02:15', '02:30', '02:45','03:00', 
          '03:15', '03:30', '03:45','04:00',
          '04:15', '04:30', '04:45','05:00', 
          '05:15', '05:30', '05:45','06:00',
          '06:15', '06:30', '06:45','07:00', 
          '07:15', '07:30', '07:45','08:00',
          '08:15', '08:30', '08:45','09:00', 
          '09:15', '09:30', '09:45','10:00',
          '10:15', '10:30', '10:45','11:00', 
          '11:15', '11:30', '11:45','12:00',
          '12:15', '12:30', '12:45','13:00', 
          '13:15', '13:30', '13:45','14:00',
          '14:15', '14:30', '14:45','15:00', 
          '15:15', '15:30', '15:45','16:00',
          '16:15', '16:30', '16:45','17:00', 
          '17:15', '17:30', '17:45','18:00',
          '18:15', '18:30', '18:45','19:00', 
          '19:15', '19:30', '19:45','20:00',
          '20:15', '20:30', '20:45','21:00', 
          '21:15', '21:30', '21:45','22:00',
          '22:15', '22:30', '22:45','23:00', 
          '23:15', '23:30', '23:45'
         ],
         onSelectTime:function( ct ){
         
          }
        });
         
         }
         
         
    });
  });

    this.calculateTotal();
    // this.createForm();
    this.route.paramMap.subscribe((params) => {

      if (params.get('reservenow')) {
        this.reserveNow = true;
      }
      if (params.get('spot')) {
        const spot = params.get('spot') ? JSON.parse(params.get('spot').toString().toLowerCase()) :
          new AvailableSpotsRequest();
        this.spotDetails = new AvailableSpotsRequest();
        this.spotDetails.FromDate = new Date(spot.fromdate);
        this.spotDetails.ToDate = new Date(spot.todate);
        this.reserveNow = true;

      }
    });

    let email = atob(this.cookieService.get('secure_data1'));
    let password = atob(this.cookieService.get('secure_data2'));
    let rememberMe: boolean = false;

    if (email && password) {
      rememberMe = true;
    }
    this.loginForm = this.fb.group({
      email: [email, [Validators.required,
      // Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
      Validators.email
      ]],
      password: [null, [Validators.required, Validators.email]],
      rememberMe: [rememberMe]


    });

    this.loginForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.loginForm);
    })
    if (this.authenticationService.userValue) {
      this.isGuestUser = true;
      this.guestUserEmail = this.authenticationService.userValue.email;
      this.userName = this.authenticationService.userValue.username.replace('_', ' ');
    }
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
      this.logLoginValidationErrors(this.registerForm);
    })

    this.fromDate = moment(this.spotDetails?.FromDate);
    this.toDate = moment(this.spotDetails?.ToDate);
    
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
   marksAsTouched() {
    this.registerForm.get('iAgree').markAsTouched();
  }
  hidedivpanel()
  {
    this.hidediv=!this.hidediv;
  }
  public setDate(date: string): any {
    let now = new Date(date);
    let minutes = now.getMinutes();
    let hours = now.getHours();
    let m = (Math.round(minutes / 15) * 15) % 60;
    let h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
    let quarterIntervalDate = new Date().setHours(h);
    quarterIntervalDate = new Date(quarterIntervalDate).setMinutes(m);
    quarterIntervalDate = new Date(quarterIntervalDate).setSeconds(0);
    return quarterIntervalDate;
  }
  loginclick(value,index)
  {
    this.selectedTabIndex=index;
    this.modalService.open(value, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  onChangeDateClick() {
    this.changeDate = true;
  }
  onChangeDateClickCancel() {
    this.changeDate = false;
  }

  calculateTotal() {
    this.total = 0;
    this.bookedPlaces.forEach((place) => {
    });

  }

  feeAmountCalculate(extraFees: any[], groupCheckOutAmount: number) {
    let extraAmount: number = 0;
    let additionalFeeCount: number = 0;
    if (extraFees) {
      extraFees.forEach((value, index) => {
        additionalFeeCount += 1;
        if (value.feeType == FeeType.Percent) {
          extraAmount += groupCheckOutAmount * (value.feeAmount / 100);
        }
        else if (value.feeType == FeeType.Dollor) {
          extraAmount += value.feeAmount;
        }

      });
    }


    return { extraAmount: extraAmount, additionalFeeCount: additionalFeeCount };
  }


  // createForm() {
  //   this.loginForm = this.formBuilder.group({
  //     [CART_INFORMATION_METADATA.email]: ['', [Validators.required, Validators.email]],
  //     [CART_INFORMATION_METADATA.password]: ['', Validators.required],
  //   });
  // }

  nextStep() {
    this.guestUserEmail = this.loginForm.get('email').value;
    this.isGuestUser = true;
    this.isGuestUserClicked = true;
    this.next.emit({ formType: 'guest', email: this.guestUserEmail, guestBtnClick: true });
  }

  // login() {
  //   const userLogin = {
  //     email: this.loginForm.get(CART_INFORMATION_METADATA.email).value,
  //     password: this.loginForm.get(CART_INFORMATION_METADATA.password).value,
  //   };
  //   this.userService.userLogin(userLogin).subscribe((response) => {
  //     localStorage.setItem('userData', JSON.stringify(response));
  //     this.userService.userStatusChanged.next(true);
  //     this.next.emit('user');
  //   });
  // }


  public get getPasswordControl() {
    return this.loginForm.get('password');
  }

  formErrors = {
    email: '',
    password: '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    email: {
      required: 'Email is required!',
      email: 'Enter a valid email address!'
    },
    password: {
      required: 'Password is required!'

    }
  };


  logValidationErrors(group: FormGroup = this.loginForm): void {
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

  logLoginValidationErrors(group: FormGroup = this.registerForm): void {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formloginErrors[key] = '';

      if (abstractControl && !abstractControl.valid && abstractControl.touched) {
        const messages = this.validationLoginMessages[key];
        
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            if (this.formloginErrors[key] == '')
              this.formloginErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logLoginValidationErrors(abstractControl);
      }
    });
  }

  showSwal(title) {
    swal({
      title: title,
      // text: text,
      buttonsStyling: false,
      confirmButtonClass: "btn btn-fill btn-success",
      // type: "success"

    }).then((result) => {
      if (result.value) {
        this.router.navigate(['pages/changepassword', this.loginForm.get('email').value]);
      }
      else {
        this.router.navigate(['pages/changepassword', this.loginForm.get('email').value]);
      }
    });

  }
  loginError: string;
  loginButtonClicked: boolean = false;
  onSubmit1():void{

    if (this.registerForm.invalid) {
      this.logLoginValidationErrors(this.registerForm)

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
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.logValidationErrors(this.loginForm)

    }
    else {
      this.loginButtonClicked = true;
      this.loginError = null;
      let userLogin = new UserLogin();
      userLogin.Email = this.loginForm.get('email').value;
      userLogin.Password = this.loginForm.get('password').value;

      this.loginService.userLogin(userLogin).subscribe((response: ApiResponse<User>) => {
        if (response.data) {

          let rememberMe: boolean = this.loginForm.get('rememberMe').value;
          if (rememberMe) {
            this.cookieService.set('secure_data1', btoa(userLogin.Email));
            this.cookieService.set('secure_data2', btoa(userLogin.Password));
          }
          else {
            this.cookieService.delete('secure_data1');
            this.cookieService.delete('secure_data2');
          }
          this.authenticationService.setUserValue(response.data);
          // this.getCartDetails();
          this.guestUserEmail = userLogin.Email;
          // this.bookedPlaces = this.placesService.cartPropertyGroup;
          this.isGuestUser = true;
          // if (!this.reserveNow) {

          let cart: Cart[] = [];

          if (this.placesService.cartPropertyGroup) {

            this.placesService.cartPropertyGroup.forEach((val, index) => {
              let cartDetails = new Cart();
              cartDetails.PropertyGroupID = val.propertyGroupID;
              cartDetails.FromDate = val.fromDate;
              cartDetails.ToDate = val.toDate;
              cartDetails.Amount = val.pricingAmount;
              cart.push(cartDetails);
            });

          }

          this.cartService.addCart(cart).subscribe((response:any) => {
            
            if (!this.reserveNow) {
            this.getCartDetails();
            }
            else
            {
              this.placesService.cartPropertyGroup.forEach((val, index) => {
                val.cartID=response.data.insertedRecordID;
              });
              this.next.emit({ formType: 'user', email: this.guestUserEmail, guestBtnClick: false,loggedIn:false });
            }

          }, (error) => {
            console.log(error);

          });

          // }
          // else {
          //   this.next.emit({ formType: 'user', email: this.guestUserEmail });
          // }

        }

        this.userName = this.authenticationService.userValue.username.replace('_', ' ');

        this.modalService.dismissAll();
      },

        (error) => {
          if (error == 'Password has expired') {
            this.showSwal(error);
          }
          this.loginButtonClicked = false;
          this.loginError = error;
        })
    }
  }

  getCartDetails() {

    this.cartService.getCartDetails().subscribe((response) => {
      this.placesService.cartPropertyGroup = response.data;

      this.placesService.cartPropertyGroup.forEach((place, index) => {

        this.placesService.cartPropertyGroup[index].checkoutAmount = this.placesService.cartPropertyGroup[index].calculatedAmount;
      });

      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
      this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
      this.bookedPlaces = this.placesService.cartPropertyGroup;

      this.bookedPlaces.forEach((o) => {
        o.changeDateClick = false;
        o.changeSearchFromDateTime = moment(o.searchFromDateTime);
        o.changesearchToDateTime = moment(o.searchToDateTime);

        o.searchFromDateTime = moment(o.searchFromDateTime);
        o.searchToDateTime = moment(o.searchToDateTime);
        // o.isSpotAvaliable = true;
      });

      this.next.emit({ formType: 'user', email: this.guestUserEmail });

    }, (error) => {
      console.log(error);

    })
  }
  public changeDateClick(place) {
    place.changeDateClick = true;
    
    jQuery('#datetimepicker').datetimepicker({
      minDate:new Date(),
      format:'Y-m-d h:i:s A',
      formatTime:"h:i A",
      step:60,
      allowTimes:[
        '00:00','00:15', '00:30', '00:45','01:00', 
        '01:15', '01:30', '01:45','02:00', 
        '02:15', '02:30', '02:45','03:00', 
        '03:15', '03:30', '03:45','04:00',
        '04:15', '04:30', '04:45','05:00', 
        '05:15', '05:30', '05:45','06:00',
        '06:15', '06:30', '06:45','07:00', 
        '07:15', '07:30', '07:45','08:00',
        '08:15', '08:30', '08:45','09:00', 
        '09:15', '09:30', '09:45','10:00',
        '10:15', '10:30', '10:45','11:00', 
        '11:15', '11:30', '11:45','12:00',
        '12:15', '12:30', '12:45','13:00', 
        '13:15', '13:30', '13:45','14:00',
        '14:15', '14:30', '14:45','15:00', 
        '15:15', '15:30', '15:45','16:00',
        '16:15', '16:30', '16:45','17:00', 
        '17:15', '17:30', '17:45','18:00',
        '18:15', '18:30', '18:45','19:00', 
        '19:15', '19:30', '19:45','20:00',
        '20:15', '20:30', '20:45','21:00', 
        '21:15', '21:30', '21:45','22:00',
        '22:15', '22:30', '22:45','23:00', 
        '23:15', '23:30', '23:45'
       ] ,
       onSelectTime:function( ct ){
        jQuery('#todatetimepicker').datetimepicker('hide');
        jQuery('#datetimepicker').datetimepicker('hide');
       jQuery('#todatetimepicker').datetimepicker('show');
       var today=new Date(jQuery('#datetimepicker').val());
       today.setHours(today.getHours() + 1);
       jQuery('#todatetimepicker').val(today);
      },
      onChangeDateTime:function( ct ){
       debugger;
       var today=new Date(ct);
       today.setHours(today.getHours() + 1);
       jQuery('#todatetimepicker').datetimepicker({minDate:ct,format:'Y-m-d h:i:s A',
       value:today,
       formatTime:"h:i A",
        step:60,
       allowTimes:[
        '00:00','00:15', '00:30', '00:45','01:00', 
        '01:15', '01:30', '01:45','02:00', 
        '02:15', '02:30', '02:45','03:00', 
        '03:15', '03:30', '03:45','04:00',
        '04:15', '04:30', '04:45','05:00', 
        '05:15', '05:30', '05:45','06:00',
        '06:15', '06:30', '06:45','07:00', 
        '07:15', '07:30', '07:45','08:00',
        '08:15', '08:30', '08:45','09:00', 
        '09:15', '09:30', '09:45','10:00',
        '10:15', '10:30', '10:45','11:00', 
        '11:15', '11:30', '11:45','12:00',
        '12:15', '12:30', '12:45','13:00', 
        '13:15', '13:30', '13:45','14:00',
        '14:15', '14:30', '14:45','15:00', 
        '15:15', '15:30', '15:45','16:00',
        '16:15', '16:30', '16:45','17:00', 
        '17:15', '17:30', '17:45','18:00',
        '18:15', '18:30', '18:45','19:00', 
        '19:15', '19:30', '19:45','20:00',
        '20:15', '20:30', '20:45','21:00', 
        '21:15', '21:30', '21:45','22:00',
        '22:15', '22:30', '22:45','23:00', 
        '23:15', '23:30', '23:45'
       ],
       onSelectTime:function( ct ){
       
        }
      });
       
       }
       
       
  });

  }
  public changeDateCancelClick(place) {
    place.changeDateClick = false;
    place.changeSearchFromDateTime = place.searchFromDateTime;
    place.changesearchToDateTime = place.searchToDateTime;
  }

  // isDateRangeValid: boolean[] = [];

  fromDateChange(place) {
    let date = place.changeSearchFromDateTime;
    let toDate = place.changesearchToDateTime;

    if (this.pricingType.Monthly == place.pricingCode) {
      place.changesearchToDateTime = moment(place.changeSearchFromDateTime).add(1, 'M');
    }
    else if (
      date &&
      toDate &&
      moment(date).isSameOrAfter(toDate)
    ) {

      place.isDateRangeValid = false;
    }
    else {
      place.isDateRangeValid = true;
    }

  }

  toDateChange(place) {
    let date = place.changesearchToDateTime;
    let fromDate = place.changeSearchFromDateTime;
    if (
      date &&
      fromDate &&
      moment(date).isSameOrBefore(fromDate)
    ) {
      place.isDateRangeValid = false;

    }
    else {
      place.isDateRangeValid = true;
    }

  }

  // isDateRangeValid: boolean = true;
  // showSubmitButton() {
  //   let found = this.bookedPlaces.some(s => s.isDateRangeValid == false);
  //   if (found) {
  //     this.isDateRangeValid = false;
  //   }
  //   else {
  //     this.isDateRangeValid = true;
  //   }
  // }

  public changeDateApply(place, index) {
    place.searchFromDateTime = moment(place.changeSearchFromDateTime);
    place.searchToDateTime = moment(place.changesearchToDateTime);

    let fromDate = new Date(place.searchFromDateTime);
    let toDate = new Date(place.searchToDateTime);

    if (!moment(place.searchFromDateTime).isSameOrBefore(new Date())) {
      place.showDateError = false;
    }

    let availableSpotsRequest = new AvailableSpotsRequest();
    availableSpotsRequest.PropertyGroupID = place.propertyGroupID;
    availableSpotsRequest.FromDate = fromDate;
    availableSpotsRequest.ToDate = toDate;
    availableSpotsRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
    availableSpotsRequest.ToTime = moment(toDate).format("hh:mm:ss A");
    availableSpotsRequest.PropertyGroupAmount = place.pricingAmount;
    availableSpotsRequest.PriceCode = place.pricingCode;

    this.placesService.SpotAvalibilityCheckonCheckOut(availableSpotsRequest)
      .subscribe((response) => {
        place.changeDateClick=false;
        this.bookedPlaces[index].isSpotAvaliable = response.data.isSpotAvaliable;
        this.bookedPlaces[index].calculatedAmount = response.data.propertyGroupAmount;

        if (this.bookedPlaces[index].discountedPrice) {
          let discount =
            this.bookedPlaces[index].calculatedAmount * (this.bookedPlaces[index].discountedPrice / 100);
          this.bookedPlaces[index].checkoutAmount = this.bookedPlaces[index].calculatedAmount - discount;
        }
        else {
          this.bookedPlaces[index].checkoutAmount = this.bookedPlaces[index].calculatedAmount;
        }

        this.placesService.cartPropertyGroup = this.bookedPlaces;
        this.placesService.addedCartPropertyGroup.next(this.bookedPlaces);
        this.changeDateCancelClick(place);
      }, (error) => {
        this.httpError = error;
      });
  }

  hideRemoveCartItemBtn: Boolean = false;
  public removecartItem(index) {
    this.hideRemoveCartItemBtn = true;
    if (this.authenticationService.isAuthorized()) {
      this.cartService.deleteCart(this.placesService.cartPropertyGroup[index].cartID).
        subscribe((response) => {

          this.placesService.cartPropertyGroup.splice(index, 1);
          localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

          this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

          this.bookedPlaces = this.placesService.cartPropertyGroup;
          this.calculateTotal();
          this.hideRemoveCartItemBtn = false;

        }, (error) => {
          this.hideRemoveCartItemBtn = false;
          console.log(error);
        })
    }
    else {
      this.placesService.cartPropertyGroup.splice(index, 1);

      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

      this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
      this.bookedPlaces = this.placesService.cartPropertyGroup;
      this.calculateTotal();
      this.hideRemoveCartItemBtn = false;
    }

  }
}
