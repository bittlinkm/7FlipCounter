import {Component, signal} from '@angular/core';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatCardContent} from '@angular/material/card';
import {MatProgressSpinner, ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-display-player',
  imports: [
    MatLabel,
    MatIcon,
    MatFormField,
    FormsModule,
    MatCardContent,
    MatProgressSpinner,
    MatIconButton,
    MatInput,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './display-player.component.html',
  styleUrl: './display-player.component.scss',
  standalone: true,
})
export class DisplayPlayerComponent {
  playerName=signal<string>('');
  mode: ProgressSpinnerMode = 'determinate';
  counter = signal<number>(0);
  maxValueCounter = signal<number>(200);
}
