import {Component, input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-icon',
  imports: [
    NgIf
  ],
  templateUrl: './icon.component.html',
  standalone: true,
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  // Optional Inputs
  src = input('');
  size = input(24);

  public isUrl(): boolean {
    return this.src().includes('.svg') ?? false;
  }
}
