import {AfterViewInit, Component, ElementRef, inject, model, OnInit, ViewChild} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';

interface EditNameData {
  name: string;
}

@Component({
  selector: 'app-edit-player',
  imports: [
    MatFormFieldModule,
    MatDialogContent,
    MatInputModule,
    MatDialogActions,
    FormsModule,
    MatButton,
  ],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss',
  standalone: true
})
export class EditPlayerComponent implements OnInit, AfterViewInit{
  readonly dialogRef = inject(MatDialogRef<EditPlayerComponent>);
  readonly data = inject<EditNameData>(MAT_DIALOG_DATA);
  @ViewChild('nameInput') nameInput!: ElementRef;
  readonly name = model<string>('');

  ngOnInit(): void {
    this.name.set(this.data.name)
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close(this.name());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 300);
  }

}
