import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-partnership',
  templateUrl: './partnership.component.html',
  styleUrls: ['./partnership.component.scss']
})
export class PartnershipComponent implements OnInit {
  emailUsFormGroup: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService, private dialogService: ConfirmDialogService, private metaTagService: Meta) { }

  ngOnInit() {

    this.emailUsFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      message: ['', Validators.required],
      phone: ['', [Validators.pattern("^[1234567890][0-9]{9}$")]]
    });

    this.emailUsFormGroup.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.emailUsFormGroup);
    });

    this.metaTagService.updateTag(
      { name: 'title', content: 'Partner With Edyoos To Provide Easy Online Parking Reservations' }
    );
    this.metaTagService.updateTag(
      {
        name: 'description', content: '#1 in revenue retention. Profitable, effortless, advanced parking ' +
          'management. Set your schedule, advertise your business, and choose your profit with Edyoos&#39; ' +
          'simple, seamless parking management platform. Everything you need to keep things running ' +
          'smoothly, all in one place, and 100% free.'
      }
    );

    this.metaTagService.updateTag(
      {
        name: 'keywords', content: 'parking management, parking services, parking reservations, parking for ' +
          'businesses, parking software, free parking platform'
      }
    );

  }

  sendMessage() {

    const body = {
      SentFrom: this.emailUsFormGroup.get('email').value,
      SentMessage: this.emailUsFormGroup.get('message').value,
      FirstName: this.emailUsFormGroup.get('firstName').value,
      LastName: this.emailUsFormGroup.get('lastName').value,
      PhoneNumber: this.emailUsFormGroup.get('phone').value,
      FromBusiness: true
    };

    this.userService.EmailUs(body).subscribe((response) => {
      this.emailUsFormGroup.reset();
      const options = {
        title: 'Message',
        message: 'Your Message has been sent',
        confirmText: 'OK'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {

        }
      });

    }, (error) => {
      console.log(error);

    })
  }

  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    phone: ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    email: {
      required: 'Email is required!',
      email: 'Enter a valid email address!'
    },
    firstName: {
      required: 'FirstName is required!'
    },
    lastName: {
      required: 'Last Name is required!'
    },
    phone: {
      pattern: 'Phone must be a valid phone number'
    },
    message: {
      required: 'Message is required!'
    }
  };

  logValidationErrors(group: FormGroup = this.emailUsFormGroup): void {
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

}
