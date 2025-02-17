import {
  Component, effect,
  input, model, output, signal,
} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {BaseInputDirective} from '../../../directives/base-input.directive';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormsModule, MatInput, MatLabel, MatFormField, MatError],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})

export class TextInputComponent extends BaseInputDirective<any>{
  // Required Inputs
  type = input.required<'text' | 'email' | 'password' | 'number'>();

  // Optional Inputs
  id = input<string>('');
  readonly = input<boolean>(false);
  helperText = input<string>('');
  isValid = input<boolean>(true);
  minLength = input<number>();
  maxLength = input<number>();
  onlyNumbers = input<boolean>();
  onlyCharacters = input<boolean>();
  emailInput = input<boolean>();
}

