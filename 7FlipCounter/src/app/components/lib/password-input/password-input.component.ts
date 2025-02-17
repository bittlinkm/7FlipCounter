import {Component, input, model} from '@angular/core';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { passwordRequirements } from '../../../definitions/PasswordRequirements';
import {FormsModule, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import { BaseInputDirective } from '../../../directives/base-input.directive';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {PasswordStrengthDirective} from '../../../directives/password-strength.directive';
import {CommonModule, NgIf} from '@angular/common';
import {IconComponent} from '../icon/icon.component';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-password-text-input',
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    PasswordStrengthDirective,
    NgIf,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    IconComponent,
    MatTooltip,
    ReactiveFormsModule,
  ],
  templateUrl: './password-input.component.html',
  standalone: true,
  styleUrl: './password-input.component.scss',
})
export class PasswordInputComponent extends BaseInputDirective {
  protected readonly hidePasswordIcon = mdiEyeOff;
  protected readonly showPasswordIcon = mdiEye;
  protected showPassword = false;

  // Optional Inputs
  passwordRequirements = input(passwordRequirements);
  autocompletePassword = input('off');
  enterPressed = model<undefined>();

  protected getPasswordErrorText(errors: ValidationErrors): string {
    console.log('error',errors);
    const errorTexts: string[] = [];

    if (errors['hasMinLength'] === false) {
      errorTexts.push(
        `Min. Länge von ${
          this.passwordRequirements().minLength
        } Zeichen erwartet`
      );
    }

    if (errors['hasMinDigits'] === false) {
      errorTexts.push(
        `Min. ${this.passwordRequirements().minNumberOfDigits} Zahlen erwartet`
      );
    }

    if (errors['hasMinSpecialChars'] === false) {
      errorTexts.push(
        `Min. ${
          this.passwordRequirements().minNumberOfSpecialCharacters
        } Sonderzeichen erwartet`
      );
    }

    if (errors['hasMinUppercase'] === false) {
      errorTexts.push(
        `Min. ${
          this.passwordRequirements().minNumberOfUppercaseCharacters
        } Großbuchstaben erwartet`
      );
    }

    if (errors['hasMinLowercase'] === false) {
      errorTexts.push(
        `Min. ${
          this.passwordRequirements().minNumberOfLowercaseCharacters
        } Kleinbuchstaben erwartet`
      );
    }

    return errorTexts.join(', ');
  }
}
