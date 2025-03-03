import {AfterViewInit, Component, ElementRef, inject, model, OnDestroy, signal, ViewChild} from '@angular/core';
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
    MatCheckbox
  ],
  templateUrl: './add-player-dialog.component.html',
  styleUrl: './add-player-dialog.component.scss',
  standalone: true
})
export class AddPlayerDialogComponent implements AfterViewInit, OnDestroy{
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

  getSelectedCount(): number {
    return this.regularNameList().filter(nameItem => nameItem.selected).length;
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 300);

    const inputElement = this.nameInput.nativeElement;

    inputElement.addEventListener('touchstart', function() {
      inputElement.focus();
    });
  }

  ngOnDestroy(): void {
    this.regularNameList().forEach(item => {item.selected = false;});
  }
}
