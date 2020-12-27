import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ErrorModel } from 'src/app/model/login/error.model';
import swal from 'sweetalert2';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { ChangePassword } from 'src/app/model/login/change_password.model';
import { LoginService } from '../../shared/authentication/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/helper/custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changepasswordConfirm: FormGroup;

  email: string;
  httpError: any[];
  submitBtnDisable: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.email = this.route.snapshot.paramMap.get('email');


    this.changepasswordConfirm = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      currentPassword: ['', [Validators.required]],
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
      }, { validator: CustomValidators.matchPassword })

    });

    this.changepasswordConfirm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.changepasswordConfirm);
    })

  }
  public get getPasswordControl() {
    return this.changepasswordConfirm.get('passwordGroup').get('password');
  }

  formErrors = {
    email: '',
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
    passwordGroup: ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    email: {
      required: 'Email is required!',
      email: 'Enter a valid email address!'
    },
    currentPassword: {
      required: 'Current Password Password is required.'
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
  };


  logValidationErrors(group: FormGroup = this.changepasswordConfirm): void {

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


  showSwal(title) {
    swal({
      title: title,
      // text: text,
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

  onSubmit(): void {
    this.submitBtnDisable = true;
    if (this.changepasswordConfirm.invalid) {
      this.logValidationErrors(this.changepasswordConfirm)
    }
    else {
      let changePassword = new ChangePassword();
      changePassword.Email = this.changepasswordConfirm.get('email').value;
      changePassword.CurrentPassword = this.changepasswordConfirm.get('currentPassword').value;
      changePassword.NewPassword = this.changepasswordConfirm.get('passwordGroup').get('password').value;

      this.loginService.changePassword(changePassword).subscribe((response: ApiResponse<string>) => {
        this.submitBtnDisable = false;
        if (response.data) {
          this.showSwal(response.data);

        }
        else {
          this.httpError = response.errors;
        }
      }, (error) => {
        this.submitBtnDisable = false;
        this.httpError = error;

      });
    }

  }

}


