import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isLengthValid = value.length >= 8;

  const errors: ValidationErrors = {};

  if (!hasUpperCase) {
    errors['noUpperCase'] = true;
  }
  if (!hasLowerCase) {
    errors['noLowerCase'] = true;
  }
  if (!hasNumber) {
    errors['noNumber'] = true;
  }
  if (!hasSpecialChar) {
    errors['noSpecialChar'] = true;
  }
  if (!isLengthValid) {
    errors['minlength'] = { requiredLength: 8, actualLength: value.length };
  }

  return Object.keys(errors).length ? errors : null;
} 