import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static matchPassword(group: AbstractControl): { [key: string]: any } | null {

      const passwordControl = group.get('password');
      const confirmPasswordControl = group.get('passwordConfirmation');
    
      if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine) {
        return null;
      } else {
        confirmPasswordControl.setErrors({ 'passwordMismatch': true });
        return { 'passwordMismatch': true };
      }
    }

}