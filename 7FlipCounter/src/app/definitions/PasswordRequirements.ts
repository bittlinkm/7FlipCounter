import {PasswordStrengthRequirements} from '../directives/password-strength.directive';

export const passwordRequirements: PasswordStrengthRequirements = {
  minLength: 6,
  minNumberOfDigits: 1,
  minNumberOfSpecialCharacters: 1,
  minNumberOfUppercaseCharacters: 1,
  minNumberOfLowercaseCharacters: 1,
};
