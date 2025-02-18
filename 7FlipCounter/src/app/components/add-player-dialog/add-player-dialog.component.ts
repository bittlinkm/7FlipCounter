import {AfterViewInit, Component, inject, model, viewChild} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {ContentComponent} from '../content/content.component';
import {Player} from '../../models/player';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-add-player-addPlayerDialog',
  imports: [
    MatDialogClose,
    MatDialogActions,
    MatLabel,
    MatDialogContent,
    MatFormField,
    FormsModule,
    MatInput,
    MatButton
  ],
  templateUrl: './add-player-dialog.component.html',
  styleUrl: './add-player-dialog.component.scss',
  standalone: true
})
export class AddPlayerDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ContentComponent>);
  readonly data = inject<Player>(MAT_DIALOG_DATA);
  readonly name = model();

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
