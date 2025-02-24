import {Component, inject, signal} from '@angular/core';
import {Player} from '../../models/player';
import {FormsModule} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {ContentComponent} from '../content/content.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';

@Component({
  selector: 'app-select-startplayer-dialog',
  imports: [
    FormsModule,
    MatButton,
    MatDialogClose,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './select-startplayer-dialog.component.html',
  styleUrl: './select-startplayer-dialog.component.scss',
  standalone: true
})
export class SelectStartplayerDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ContentComponent>);
  readonly players = signal<Player[]>(inject(MAT_DIALOG_DATA));
  readonly selectedPlayer  = signal<Player | undefined>(undefined);

  onCancelClick(): void {
    this.dialogRef.close();
  }


}
