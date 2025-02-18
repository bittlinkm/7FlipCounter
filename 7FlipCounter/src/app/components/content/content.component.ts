import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild, viewChild} from '@angular/core';
import {PlayerService} from '../../services/player.service';
import {Player} from '../../models/player';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material/dialog';
import {AddPlayerDialogComponent} from '../add-player-dialog/add-player-dialog.component';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatIcon} from '@angular/material/icon';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatProgressSpinner, ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {TextInputComponent} from '../lib/text-input/text-input.component';
import {MatSort, MatSortHeader} from '@angular/material/sort';

@Component({
  selector: 'app-content',
  imports: [MatTable,
    MatButton,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    CdkDropList,
    MatIcon,
    CdkDrag, CdkDragHandle, MatIconButton, MatProgressSpinner, TextInputComponent, MatSort, MatSortHeader],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  standalone: true
})
export class ContentComponent implements OnInit, AfterViewInit, OnDestroy {
 readonly playerService = inject(PlayerService);
 readonly addPlayerDialog = inject(MatDialog);
 readonly deleteDialog = inject(MatDialog);
 displayedColumns: string[] = [ 'delete','position', 'name', 'score', 'round'];
 dataSource = new MatTableDataSource<Player>([]);
 selection = new SelectionModel<Player>(false, []);
// table = viewChild<MatTable<Player>>('table') ;
  @ViewChild('table', {static: true}) table!: MatTable<Player>;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.sortingDataAccessor = (player, property) => {
      switch (property) {
        case 'score':
          return this.counter(player);
        default:
          return player[property];
      }
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  spinnerValue(player: Player): number {
    return this.playerService.getPlayerScore(player.id)/2;
  }

  counter(player: Player): number {
    return this.playerService.getPlayerScore(player.id);
  }

  openAddPlayerDialog() {
    const dialogRef = this.addPlayerDialog.open(AddPlayerDialogComponent );

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let newPlayer = this.playerService.createPlayer(result);
        this.dataSource.data = [...this.dataSource.data,newPlayer];
      }
    });
  }

  openDeleteDialog(player: Player): void {
    const dialogRef = this.addPlayerDialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removePlayer(player);
      }
    })
  }

  removePlayer(player: Player): void {
    const index = this.dataSource.data.indexOf(player);
    if (index > -1) {
      const data = this.dataSource.data;
      data.splice(index, 1);
      this.dataSource.data = [...data];

      this.dataSource.data.forEach((item, index) => {
        item.position = index + 1;
      });
    }

    this.playerService.deletePlayerFromLocalStorage(player.id);
  }

  drop(event: CdkDragDrop<Player[]>): void {
    const previousIndex = this.dataSource.data.findIndex(d => d === event.item.data);
    const currentIndex = event.currentIndex;
    if(previousIndex !== currentIndex) {
      moveItemInArray(this.dataSource.data, previousIndex, currentIndex);
      this.dataSource.data = [...this.dataSource.data];

    }
    this.table.renderRows();
  }

  focusOutFromRoundInput(player: Player, event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const roundScore = Number(inputElement.value);

    this.playerService.updatePlayerScore(player.id, roundScore);
  }

  ngOnDestroy(): void {
    this.playerService.clearLocalStorage();
  }
}
