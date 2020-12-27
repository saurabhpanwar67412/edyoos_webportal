import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export const Change_Password_Metadata = {
  currentPassword: "currentPassword",
  newPassword: "newPassword",
  confirmPassword: "confirmPassword"
}

export const Profile_METADATA = {
  firstName: "firstName",
  lastName: "lastName",
  gender: "gender",
  email: "email",
  phoneNumber: "phoneNumber",
  address1: "addressLine1",
  address2: "addressLine2",
  city: "city",
  state: "state",
  zipCode: "zipCode",
  aboutYou: "aboutYou",

  currency: "currency",
  timezone: "timeZone",
  apt: "apt",
  files: "files"
}



export const validationMessages = {
  name: {
    required: 'Name is required!'
  },
  gender: {
    required: 'Gender is required!'
  },
  email: {
    required: 'Email must be a valid email address!',
    emailVaidatorsfor: 'Enter Valid Email Address',
    pattern: ''
  },
  phone: {
    required: 'Phone Number is required!',
    pattern: 'Phone Number should be 10 digit'
  },
  phoneNumber: {
    required: 'Phone Number is required!',
    pattern: 'Phone Number should be 10 digit'
  },
  address: {
    required: 'address is required!'
  },
  files: {
    required: 'File upload is required!'
  }
};
export class emailVaidatorsfor {
  static emailVaidator(AC: FormControl): { [key: string]: any } {

    const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (AC && AC.value && !emailRegexp.test(AC.value)) {
      return { 'emailVaidatorsfor': true };
    }
    return null;
  }
}

export var formErrors = {
  name: "",
  gender: "",
  email: "",
  phone: "",
  phoneNumber: "",
  currency: "",
  timezone: "",
  address: "",
  apt: "",
  aboutYou: "",
  files: ""

};


/**
 * Collection of reusable error messages
 */
export const errorMessages: { [key: string]: string } = {
  name: "Name Field is Required",
  gender: "gender Field is Required",
  email: "email Field is Required",
  phone: "phone Field is Required",
  phoneNumber: "phoneNumber Field is Required",
  currency: "currency",
  timezone: "timezone",
  address: "address Field is Required",
  apt: "apt",
  aboutYou: "aboutYou",
  files: "fileToUpload Field is Required"
};
export function logValidationErrors(group: FormGroup) {

  Object.keys(group.controls).forEach((key: string) => {
    const abstractControl: ValidationErrors = group.get(key);
    formErrors[key] = '';
    if (abstractControl && !abstractControl.valid) {
      const messages = validationMessages[key];
      for (const errorKey in abstractControl.errors) {
        if (errorKey) {
          formErrors[key] += messages[errorKey] + ' ';
        }
      }
    }

    if (abstractControl instanceof FormGroup) {
      logValidationErrors(abstractControl);
    }
  });
  return formErrors;
}