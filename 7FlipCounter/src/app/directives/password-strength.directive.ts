import {Directive, Input, input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

export interface PasswordStrengthRequirements {
  minLength?: number;
  minNumberOfDigits?: number;
  minNumberOfSpecialCharacters?: number;
  minNumberOfUppercaseCharacters?: number;
  minNumberOfLowercaseCharacters?: number;
}

@Directive({
  selector: '[appPasswordStrength]',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordStrengthDirective,
    multi: true,
  }]
})

export class PasswordStrengthDirective implements Validator {
  appPasswordStrength = input();
  passwordRequirements?: PasswordStrengthRequirements;

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.passwordRequirements) {
      const value = (control.value as string) ?? '';

      const hasMinLength =
        value.length >= (this.passwordRequirements.minLength ?? 0);
      const hasMinDigits =
        (value.match(/\d/g) ?? []).length >=
        (this.passwordRequirements.minNumberOfDigits ?? 0);
      const hasMinSpecialChars =
        (value.match(/\W|_/g) ?? []).length >=
        (this.passwordRequirements.minNumberOfSpecialCharacters ?? 0);
      const hasMinUppercase =
        (value.match(/[A-Z]/g) ?? []).length >=
        (this.passwordRequirements.minNumberOfUppercaseCharacters ?? 0);
      const hasMinLowercase =
        (value.match(/[a-z]/g) ?? []).length >=
        (this.passwordRequirements.minNumberOfLowercaseCharacters ?? 0);

      const passwordValid =
        hasMinLength &&
        hasMinDigits &&
        hasMinSpecialChars &&
        hasMinUppercase &&
        hasMinLowercase;

      return passwordValid
        ? null
        : {
          hasMinLength,
          hasMinDigits,
          hasMinSpecialChars,
          hasMinUppercase,
          hasMinLowercase,
        };
    }
    return null;
  }

}
