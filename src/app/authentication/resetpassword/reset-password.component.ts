import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { LoginService } from '../../shared/authentication/login/login.service';
import { ResetPassword } from 'src/app/model/login/reset_password.model';
import { ErrorModel } from 'src/app/model/login/error.model';
import { CustomValidators } from 'src/app/helper/custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  submitted: boolean = false;
  httpError:string;
  submitBtnDisable:boolean=false;
  resetPassword: ResetPassword = new ResetPassword();


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,private loginService:LoginService) { }

  ngOnInit(): void {

    this.resetPasswordForm = this.fb.group({
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
        passwordConfirmation: ['', [Validators.required]]
      }, { validator: CustomValidators.matchPassword }),
    });

    this.route.queryParams.subscribe(params => {
      this.resetPassword.Email = params['email'];
      this.resetPassword.Token = params['token'];
    });

    this.resetPasswordForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.resetPasswordForm);
    })

  }

  formErrors = {
    password: '',
    passwordConfirmation:'',
    passwordGroup: ''
  };

  validationMessages = {
    password: {
      required: "Password is required",
      minlength: "Must be at least 8 characters!",
      hasNumber: "Must contain at least 1 number!",
      hasCapitalCase: "Must contain at least 1 in Capital Case!",
      hasSmallCase: "Must contain at least 1 Letter in Small Case!",
      hasSpecialCharacters: "Must contain at least 1 Special Character!"
    },
    passwordConfirmation:{
      required: 'Confirm Password is required.',
      passwordMismatch: 'Password and Confirm Password do not match.'
    },
    passwordGroup: {
      passwordMismatch: 'Password and Confirm Password do not match.'
    }

  };
  showSwal(title) {
   
      swal({
        title: title,
        // text: "You clicked the button!",
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

  logValidationErrors(group: FormGroup = this.resetPasswordForm): void {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (abstractControl && !abstractControl.valid) {
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

  onSubmit(): void {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      this.logValidationErrors(this.resetPasswordForm);
    }
    else {
      this.submitBtnDisable=true;
      this.resetPassword.Password=this.resetPasswordForm.get('passwordGroup').get('password').value;

      this.loginService.resetPassword(this.resetPassword).subscribe((response: ApiResponse<string>) => {
        this.submitBtnDisable=false;
        if (response.data) {        
          this.showSwal(response.data);
        }
       
      },(error)=>{
        this.submitBtnDisable=false;
        this.httpError=error;
      })
    }
  }

}
function matchPassword(group: AbstractControl): { [key: string]: any } | null {

  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('passwordConfirmation');

  if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine) {
    confirmPasswordControl.setErrors(null);
    return null;
  } else {
    confirmPasswordControl.setErrors({'passwordMismatch': true});
    return { 'passwordMismatch': true };
  }
}