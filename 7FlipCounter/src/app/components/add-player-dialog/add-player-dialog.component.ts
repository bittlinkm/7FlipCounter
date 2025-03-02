import {AfterViewInit, Component, ElementRef, inject, model, OnInit, signal, ViewChild} from '@angular/core';
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
import {MatRadioButton} from '@angular/material/radio';
import {MatCheckbox} from '@angular/material/checkbox';
import {RegularNameItem} from '../../models/regularNameItem';
import {RegularNameListService} from '../../services/regular-name-list.service';

@Component({
  selector: 'app-add-player-matDialog',
  imports: [
    MatDialogClose,
    MatDialogActions,
    MatLabel,
    MatDialogContent,
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    MatRadioButton,
    MatCheckbox
  ],
  templateUrl: './add-player-dialog.component.html',
  styleUrl: './add-player-dialog.component.scss',
  standalone: true
})
export class AddPlayerDialogComponent implements AfterViewInit{
  readonly dialogRef = inject(MatDialogRef<ContentComponent>);
  readonly data = inject<Player>(MAT_DIALOG_DATA);
  readonly name = model<string>();
  readonly showRegularNames = signal(false);
  readonly regularNameList = signal<RegularNameItem[]>([]);
  regularNameListService = inject(RegularNameListService);
  @ViewChild('nameInput') nameInput!: ElementRef;

  constructor() {
    this.regularNameList.set(this.regularNameListService.getRegularNameList());
  }

  //TODO: Edit view
  // disable ok button if no selection and no input

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getSelectedNamesOrInput(): string | string[] {
    if (this.showRegularNames()) {
      const selectedNames = this.regularNameList()
        .filter(nameItem => nameItem.selected)
        .map(nameItem => nameItem.name);

        if (selectedNames.length > 0) {
          return selectedNames;
        }
    }

    return this.name() ?? '';
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 300);

    const inputElement = this.nameInput.nativeElement;

    inputElement.addEventListener('touchstart', function() {
      inputElement.focus();
    });
  }
}
