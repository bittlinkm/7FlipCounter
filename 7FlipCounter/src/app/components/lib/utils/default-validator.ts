import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface DefaultValidatorOptions {
  minLength?: number;
  maxLength?: number;
  onlyNumbers?: boolean;
  onlyCharacters?: boolean;
  emailInput?: boolean;
}

export function defaultValidator(options: DefaultValidatorOptions): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) {
      return null;
    }

    const errors: { [key: string]: any } = {};

    if (options.minLength !== undefined && value.length < options.minLength) {
      errors['minLength'] = {
        message: `Der Wert muss mindestens ${options.minLength} Zeichen lang sein.`,
        requiredLength: options.minLength,
        actualLength: value.length
      };
    }

    if (options.maxLength !== undefined && value.length > options.maxLength) {
      errors['maxLength'] = {
        message: `Der Wert darf maximal ${options.maxLength} Zeichen lang sein.`,
        requiredLength: options.maxLength,
        actualLength: value.length
      };
    }

    if (options.onlyNumbers && !/^\d+$/.test(value)) {
      errors['onlyNumbers'] = {
        message: 'Der Wert darf nur Zahlen enthalten.'
      };
    }

    if (options.onlyCharacters && !/^[A-Za-z]+$/.test(value)) {
      errors['onlyCharacters'] = {
        message: 'Der Wert darf nur Buchstaben enthalten.'
      };
    }

    if (options.emailInput && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
      errors['emailInput'] = {
        message: 'Der Wert muss eine gültige E-Mail-Adresse sein.'
      };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}
