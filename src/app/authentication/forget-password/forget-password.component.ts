
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPassword } from 'src/app/model/login/forget_password.model';
import swal from 'sweetalert2';
import { LoginService } from '../../shared/authentication/login/login.service';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { ErrorModel } from 'src/app/model/login/error.model';

@Component({
   selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  httpError: any;
  
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,private loginService:LoginService){

  }

  ngOnInit(): void {

    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required,Validators.email,
        // Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
      ]]
    });

    this.forgetPasswordForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.forgetPasswordForm);
    })

  }

  formErrors = {
    email: ''
  };

  validationMessages = {
    email: {
      required: 'Email is required!',
      email:'Enter valid email address!'
     
    }

  };

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

  logValidationErrors(group: FormGroup = this.forgetPasswordForm): void {

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
  submitBtnDisable:boolean=false;

  onSubmit(): void {
  
    if (this.forgetPasswordForm.invalid) {
      this.logValidationErrors(this.forgetPasswordForm)
    }
    else {
    this.submitBtnDisable=true;
      let forgetPassword=new ForgetPassword();
      forgetPassword.Email=this.forgetPasswordForm.get('email').value;
      forgetPassword.ReturnUrl=`${window.location.origin}/#/pages/resetpassword`;
     
      this.loginService.forgetPassword(forgetPassword).subscribe((response: ApiResponse<string>) => {
       
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

