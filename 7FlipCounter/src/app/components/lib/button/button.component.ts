import {
  Component,
  input, output,
} from '@angular/core';
import {CommonModule, NgClass, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass, MatButtonModule, CommonModule,NgIf, MatIcon],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  // Required Inputs
  label = input.required<string>();
  type = input.required<'button' | 'submit'  |'reset'>();

  // Optional Inputs
  color = input<'primary' | 'accent' | 'warn'>();
  disabled = input<boolean>();
  icon = input<string | null>();
  buttonClass = input<string>();

  // Outputs
  clicked = output<void>();

  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
