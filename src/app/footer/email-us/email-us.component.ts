import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-email-us',
  templateUrl: './email-us.component.html',
  styleUrls: ['./email-us.component.scss']
})
export class EmailUsComponent implements OnInit {

  @ViewChild('fullName')
  public fullName: ElementRef;
  @ViewChild('email')
  public email: ElementRef;
  @ViewChild('address')
  public address: ElementRef;
  @ViewChild('message')
  public message: ElementRef;

  emailUsFormGroup:FormGroup;

  

  constructor(private userService: UserService,private fb:FormBuilder,public dialogRef: MatDialogRef<EmailUsComponent>) { }

  ngOnInit(): void {
    this.emailUsFormGroup=this.fb.group({
      fullNameFormControl:[''],
      emailFormControl:['',[Validators.email,Validators.required]],
      messageFormControl:['',Validators.required],
      addressFormControl:[''],
    });
  }

  submit() {
    const body = {
      SentFrom: this.emailUsFormGroup.get('emailFormControl').value,
      SentMessage: this.emailUsFormGroup.get('messageFormControl').value,
      UserName: this.emailUsFormGroup.get('fullNameFormControl').value,
      SentAddress: this.emailUsFormGroup.get('addressFormControl').value,
    }
    this.userService.EmailUs(body).subscribe((response)=>{
      console.log(response);
      this.emailUsFormGroup.reset();
        this.dialogRef.close();
      
    },(error)=>{
      console.log(error);
      
    })
  }

}
