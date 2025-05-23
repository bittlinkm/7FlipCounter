import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  linkedSignal,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/player';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerDialogComponent } from '../add-player-dialog/add-player-dialog.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { SelectStartplayerDialogComponent } from '../select-startplayer-dialog/select-startplayer-dialog.component';
import { NgClass } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { StartNewGameDialogComponent } from '../start-new-game-dialog/start-new-game-dialog.component';

@Component({
  selector: 'app-content',
  imports: [
    MatTable,
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
    CdkDrag,
    CdkDragHandle,
    MatIconButton,
    MatProgressSpinner,
    MatSort,
    MatSortHeader,
    MatCheckbox,
    FormsModule,
    NgClass,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ContentComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly gameService = inject(GameService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  readonly matDialog = inject(MatDialog);
  protected dataSource = new MatTableDataSource<Player>([]);
  protected selection = new SelectionModel<Player>(false, []);
  readonly editPlayersCheckBox = signal<boolean>(false);
  readonly tempScores = signal<Map<string, number>>(new Map());
  protected readonly isGameStarted = this.gameService.isGameStarted;
  protected readonly currentPlayerTurn = this.gameService.currentPlayerTurn;
  protected defaultCounterMode = signal<boolean>(true);
  isNextRoundValid = signal<boolean>(false);

  @ViewChild('table', { static: true }) table!: MatTable<Player>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('roundInput') roundInputs!: QueryList<ElementRef>;

  linkedDisplayedColumns = linkedSignal(() => {
    if (this.editPlayersCheckBox()) {
      return ['delete', 'order', 'position', 'name', 'score', 'roundInput'];
    } else {
      return ['position', 'name', 'score', 'roundInput'];
    }
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.gameService.players();
    });
  }

  ngOnInit() {
    this.editPlayersCheckBox.set(false);

    this.dataSource.sortingDataAccessor = (player, property) => {
      switch (property) {
        case 'score':
          return this.counter(player);
        case 'position':
          return Number(player.position);
        default:
          return player[property] as string | number;
      }
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async sortChange(sortState: Sort): Promise<void> {
    if (sortState.direction) {
      await this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      await this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  spinnerValue(player: Player): number {
    const tempScore = this.tempScores().get(player.id) || 0;
    return (this.gameService.getPlayerScoreById(player.id) + tempScore) / 2;
  }

  counter(player: Player): number {
    const tempScore = this.tempScores().get(player.id) || 0;
    return this.gameService.getPlayerScoreById(player.id) + tempScore;
  }

  openAddPlayerDialog() {
    const dialogRef = this.matDialog.open(AddPlayerDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (Array.isArray(result)) {
          result.forEach((playerName) => {
            this.gameService.createPlayer(playerName);
          });
        } else {
          this.gameService.createPlayer(result);
        }
      }
    });
  }

  openDeleteDialog(player: Player): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.removePlayer(player);
      }
    });
  }

  async openStartPlayerDialog(): Promise<Player | undefined> {
    const dialogRef = this.matDialog.open(SelectStartplayerDialogComponent, {
      data: this.gameService.players(),
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  removePlayer(player: Player): void {
    this.gameService.deletePlayer(player);
  }

  async onNewGame(): Promise<void> {
    this.tempScores.set(new Map());
    this.roundInputs.forEach((input) => {
      input.nativeElement.value = '';
    });

    const dialogRef = this.matDialog.open(StartNewGameDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newGameWithSamePlayers();
      } else if (result === false) {
        this.gameService.newEmptyGame();
      } else {
        return;
      }
    });
  }

  async newGameWithSamePlayers() {
    const selectedPlayer = await this.openStartPlayerDialog();

    if (selectedPlayer) {
      this.gameService.newGameWithSamePlayers(selectedPlayer);
    }
    this.isNextRoundValid.set(true);
  }

  onNextRound(): void {
    const missingRoundInput = this.hasAllPlayersRoundInput();
    if (missingRoundInput) {
      alert(`Folgende Spieler haben keine Punkte eingegeben: ${this.getPlayersWithoutRoundInput()}`);
    } else {
      this.nextRound();
    }
  }

  onToggleCounterMode(): void {
    this.defaultCounterMode.set(this.gameService.is7FlipCounterMode());
    this.defaultCounterMode.set(!this.defaultCounterMode());
    this.gameService.setDefaultCounterMode(this.defaultCounterMode());
    this.editPlayersCheckBox.set(false);
  }

  nextRound(): void {
    this.tempScores().forEach((score, playerId) => {
      this.gameService.updatePlayerScore(playerId, score);
    });

    this.tempScores.set(new Map());
    this.gameService.nextPlayerTurn();

    this.roundInputs.forEach((input) => {
      input.nativeElement.value = '';
    });
    if (this.defaultCounterMode()) {
      this.checkEndGame();
    }
  }

  checkEndGame(): void {
    if (this.gameService.isGameStarted() && this.gameService.isGameFinished()) {
      const winner = this.gameService.getWinner();
      let winnerMessage: string = 'Spiel beendet. Gewinner: ';

      if (Array.isArray(winner)) {
        const winnerString = winner.map((winner) => winner.name).join(', ');
        winnerMessage += winnerString;
      } else if (winner) {
        winnerMessage += winner.name;
      } else {
        winnerMessage = 'Spiel beendet. Kein Gewinner';
      }

      alert(winnerMessage);
      this.isNextRoundValid.set(false);
    }
  }

  isCurrentPlayer(position: number): boolean {
    return this.isGameStarted() && position === this.currentPlayerTurn();
  }

  private hasAllPlayersRoundInput(): boolean {
    const playersWithoutRoundInput = this.getPlayersWithoutRoundInput();
    return !!playersWithoutRoundInput;
  }

  private getPlayersWithoutRoundInput(): string | false {
    const playersWithoutRoundInput: string[] = [];

    this.dataSource.data.forEach((player) => {
      if (!this.tempScores().has(player.id)) {
        playersWithoutRoundInput.push(player.name);
      }
    });

    if (playersWithoutRoundInput.length > 0) {
      return playersWithoutRoundInput.join(', ');
    }
    return false;
  }

  dragAndDrop(event: CdkDragDrop<Player[]>): void {
    const previousIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    const currentIndex = event.currentIndex;
    this.gameService.movePlayerPosition(previousIndex, currentIndex);
  }

  keyUp(player: Player, event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const roundScore = Number(inputElement.value);

    const currentTempScores = new Map(this.tempScores());
    currentTempScores.set(player.id, roundScore);
    this.tempScores.set(currentTempScores);
  }

  editName(id: string) {
    if (!this.editPlayersCheckBox()) {
      return;
    }

    const currPlayer = this.gameService.getPlayerById(id);
    const dialogRef = this.matDialog.open(EditPlayerComponent, {
      data: { name: currPlayer.name },
    });

    dialogRef.afterClosed().subscribe((newName) => {
      if (newName) {
        this.gameService.updatePlayerName(currPlayer, newName);
        console.log(newName);
      }
    });
  }

  ngOnDestroy(): void {
    this.gameService.clearLocalStorage();
  }
}
