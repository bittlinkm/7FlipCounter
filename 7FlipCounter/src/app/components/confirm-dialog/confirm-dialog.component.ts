import {Component, inject} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {ContentComponent} from '../content/content.component';

@Component({
  selector: 'app-confirm-matDialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  standalone: true
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ContentComponent>);
}
