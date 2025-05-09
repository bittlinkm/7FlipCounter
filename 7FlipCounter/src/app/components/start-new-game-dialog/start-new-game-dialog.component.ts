import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-start-new-game-dialog',
  imports: [MatDialogActions, MatDialogContent, MatButton, MatDialogClose],
  templateUrl: './start-new-game-dialog.component.html',
  styleUrl: './start-new-game-dialog.component.scss',
  standalone: true,
})
export class StartNewGameDialogComponent {}
