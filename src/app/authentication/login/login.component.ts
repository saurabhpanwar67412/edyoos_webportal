import { Component, OnInit, ElementRef, NgZone, HostListener } from '@angular/core';
import { LoginService } from '../../shared/authentication/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogin } from 'src/app/model/login/login.model';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { CookieService } from 'ngx-cookie-service';
import { ErrorModel } from 'src/app/model/login/error.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AuthenticationService } from '../../shared/authentication/authentication.service';
import { User } from 'src/app/model/login/user.model';
import { CustomValidators } from 'src/app/helper/custom-validators';
import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/shared/cart.service';
import { PlacesService } from 'src/app/shared/places.service';
import { Cart } from 'src/app/model/cart/cart.model';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

declare var window: any;
declare var FB: any;
declare var auth2: any;
declare var AppleID: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']

})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    submitBtnDisable = false;
    httpError: any;

    constructor(private fb: FormBuilder, public router: Router, private loginService: LoginService,
        private cookieService: CookieService, private authenticationService: AuthenticationService,
        private route: ActivatedRoute, private cartService: CartService, private placesService: PlacesService, public zone: NgZone) {

    }

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


    returnUrl: string;

    ngOnInit() {

        this.route.queryParams.subscribe(params => {
            this.returnUrl = params['returnurl'];
            if (this.returnUrl) {
                this.returnUrl = this.returnUrl.slice(this.returnUrl.indexOf('/') + 1, this.returnUrl.length);
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
            password: [password, Validators.required],
            rememberMe: [rememberMe]


        });

        this.loginForm.valueChanges.subscribe((data) => {
            this.logValidationErrors(this.loginForm);
        })
    }


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


    statusChangeCallback(response) {
        if (response.status === 'connected') {

            this.externalLogin(response.authResponse.accessToken);
        }
    }

    facebookLogin() {
        FB.login((response) => {
            this.statusChangeCallback(response);
        }, { scope: 'public_profile,email' });
    }


    externalLogin(accessToken: string) {
        this.authenticationService.externalFacebookLogin(accessToken).subscribe((response) => {
            this.setlocalStorageAndGetCartDetails(response);

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


    logValidationErrors(group: FormGroup = this.loginForm): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            this.formErrors[key] = '';

            if (abstractControl && !abstractControl.valid && abstractControl.touched) {
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

    setlocalStorageAndGetCartDetails(response) {
        this.authenticationService.setUserValue(response.data);

        let carts: Cart[] = [];

        if (this.placesService.cartPropertyGroup.length > 0) {

            this.placesService.cartPropertyGroup.forEach((val, index) => {
                let cartDetails = new Cart();
                cartDetails.PropertyGroupID=val.propertyGroupID; 
                cartDetails.FromDate = new Date(moment(val.searchFromDateTime).format("MM-DD-YYYY"));
                cartDetails.ToDate = new Date(moment(val.searchToDateTime).format("MM-DD-YYYY"));
                cartDetails.FromTime = moment(val.searchFromDateTime).format("hh:mm:ss A");
                cartDetails.ToTime = moment(val.searchToDateTime).format("hh:mm:ss A");
                carts.push(cartDetails);
            });



            this.cartService.afterLoginaddCart(carts).subscribe((response) => {

                // this.getCartDetails();

                if (this.returnUrl)
                    this.router.navigate([this.returnUrl]);
                else {
                    this.zone.run(() => {
                        this.router.navigate(['landing/home']);
                    });
                }

            }, (error) => {
                this.submitBtnDisable = false;
                console.log(error);

            })
        }
        else {
            // this.getCartDetails();
            if (this.returnUrl)
                this.router.navigate([this.returnUrl]);
            else {
                this.zone.run(() => {
                    this.router.navigate(['landing/home']);
                });
            }
        }
    }

    onSubmit(): void {

        if (this.loginForm.invalid) {
            this.logValidationErrors(this.loginForm)

        }
        else {
            let userLogin = new UserLogin();
            userLogin.Email = this.loginForm.get('email').value;
            userLogin.Password = this.loginForm.get('password').value;
            this.submitBtnDisable = true;
            this.loginService.userLogin(userLogin).subscribe((response: ApiResponse<User>) => {
                if (response.data) {

                    this.httpError = null;

                    let rememberMe: boolean = this.loginForm.get('rememberMe').value;
                    if (rememberMe) {
                        this.cookieService.set('secure_data1', btoa(userLogin.Email));
                        this.cookieService.set('secure_data2', btoa(userLogin.Password));
                    }
                    else {
                        this.cookieService.delete('secure_data1');
                        this.cookieService.delete('secure_data2');
                    }


                    if (!this.authenticationService.isAuthorized()) {

                        this.setlocalStorageAndGetCartDetails(response);

                    }
                    else {
                        this.authenticationService.setUserValue(response.data);
                        this.getCartDetails();
                        if (this.returnUrl)
                            this.router.navigate([this.returnUrl]);
                        else
                            this.router.navigate(['landing/home']);

                    }

                }

            }, (error) => {
                this.submitBtnDisable = false;
                if (error == 'Password has expired') {
                    this.showSwal(error);
                }
                this.httpError = error;

            })
        }
    }

    getCartDetails() {
        this.cartService.getCartDetails().subscribe((response) => {
            this.placesService.cartPropertyGroup = response.data;
            localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

        }, (error) => {
            this.submitBtnDisable = false;
            console.log(error);

        })
    }
}
