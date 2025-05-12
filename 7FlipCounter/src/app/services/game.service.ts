import { effect, Injectable, signal } from '@angular/core';
import { Player } from '../models/player';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly STORAGE_KEY_PLAYERS = 'players';
  private readonly STORAGE_KEY_GAMESTARTED = 'gamestarted';
  private readonly STORAGE_KEY_STARTPLAYER = 'startplayer';
  private readonly STORAGE_KEY_CURRPLAYERTURN = 'currplayerturn';
  private readonly STORAGE_KEY_7FLIPCOUNTERMODE = '7flipcountermode';
  private readonly goalScore: number = 200;

  private _players = signal<Player[]>([]);
  readonly players = this._players.asReadonly();

  private _isGameStarted = signal<boolean>(false);
  readonly isGameStarted = this._isGameStarted.asReadonly();

  private _currentPlayerTurn = signal<number>(0);
  readonly currentPlayerTurn = this._currentPlayerTurn.asReadonly();

  private _is7FlipCounterMode = signal<boolean>(true);
  readonly is7FlipCounterMode = this._is7FlipCounterMode.asReadonly();

  private _startPlayer = signal<Player | undefined>(undefined);
  readonly startPlayer = this._startPlayer.asReadonly();

  constructor() {
    this.loadAllPlayerFromStorage();
    this.loadGameStarted();
    this.loadStartPlayer();
    this.loadCurrentPlayerTurn();
    this.load7FlipCounterMode();

    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_PLAYERS, JSON.stringify(this._players()));
    });

    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_GAMESTARTED, JSON.stringify(this._isGameStarted()));
    });

    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_STARTPLAYER, JSON.stringify(this._startPlayer()));
    });

    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_CURRPLAYERTURN, JSON.stringify(this._currentPlayerTurn()));
    });

    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_7FLIPCOUNTERMODE, JSON.stringify(this._is7FlipCounterMode()));
    });
  }

  getPlayerById(playerId: string): Player {
    const currentPlayer = this._players().find((x) => x.id === playerId);
    if (!currentPlayer) {
      throw new Error(`Player with id ${playerId} not found in local storage.`);
    }
    return currentPlayer;
  }

  getPlayerScoreById(playerId: string): number {
    const currentPlayer = this.getPlayerById(playerId);
    return currentPlayer.score.reduce((sum: number, s: number) => sum + s, 0);
  }

  getWinner(): Player[] | Player {
    const winners = this._players().filter((player) => this.getPlayerScoreById(player.id) >= this.goalScore);

    if (winners.length === 0) {
      return [];
    }

    if (winners.length === 1) {
      return winners[0];
    }

    let highestScore = 0;
    for (const player of winners) {
      const score = this.getPlayerScoreById(player.id);
      if (score > highestScore) {
        highestScore = score;
      }
    }

    return winners.filter((player) => this.getPlayerScoreById(player.id) === highestScore);
  }

  setStartPlayer(player: Player): void {
    this._startPlayer.set(player);
    localStorage.setItem(this.STORAGE_KEY_STARTPLAYER, JSON.stringify(this._startPlayer()));
  }

  setCurrentPlayerTurn(nextPosition: number): void {
    this._currentPlayerTurn.set(nextPosition);
    localStorage.setItem(this.STORAGE_KEY_CURRPLAYERTURN, JSON.stringify(this._currentPlayerTurn()));
  }

  isGameFinished(): boolean {
    if (this._is7FlipCounterMode()) {
      const winner = this._players().filter((player: Player) => this.getPlayerScoreById(player.id) >= this.goalScore);

      return winner.length > 0;
    }
    return false;
  }

  nextPlayerTurn(): void {
    const nextPosition = this._currentPlayerTurn() >= this._players().length ? 1 : this._currentPlayerTurn() + 1;
    this.setCurrentPlayerTurn(nextPosition);
  }

  newGameWithSamePlayers(selectedPlayer: Player) {
    this._players.update((players) =>
      players.map((p) => ({
        ...p,
        score: p.id === selectedPlayer.id ? [] : p.score.map(() => 0),
      })),
    );

    this.setGameStarted(true);

    this.setStartPlayer(selectedPlayer);
    this.setCurrentPlayerTurn(selectedPlayer.position);

    if (this._currentPlayerTurn() === 0) {
      this._currentPlayerTurn.set(1);
    }
  }

  newEmptyGame(): void {
    this._players.set([]);
    this._isGameStarted.set(false);
    this._currentPlayerTurn.set(0);
    this._is7FlipCounterMode.set(true);
    this._startPlayer.set(undefined);

    this.clearLocalStorage();
  }

  createPlayer(name: string): void {
    const position = this._players().length + 1;
    const newPlayer: Player = {
      id: this.generateUniqueId(),
      position: position,
      name,
      score: [],
    };

    this._players.update((players) => [...players, newPlayer]);
  }

  updatePlayerScore(playerId: string, roundScore: number): void {
    this._players.update((players) =>
      players.map((p) => (p.id === playerId ? { ...p, score: [...p.score, roundScore] } : p)),
    );
  }

  deletePlayer(player: Player): void {
    this._players.update((players) =>
      players.filter((p) => p.id !== player.id).map((p, idx) => ({ ...p, position: idx + 1 })),
    );
  }

  updatePlayerName(player: Player, newName: string): void {
    this._players.update((players) => players.map((p) => (p.id === player.id ? { ...p, name: newName } : p)));
  }

  movePlayerPosition(previousIndex: number, currentIndex: number): void {
    if (previousIndex === currentIndex) {
      return;
    }
    this._players.update((players) => {
      const arr = [...players];
      moveItemInArray(arr, previousIndex, currentIndex);
      return arr.map((p, idx) => ({ ...p, position: idx + 1 }));
    });
  }

  setDefaultCounterMode(defaultCounterMode: boolean): void {
    this._is7FlipCounterMode.set(defaultCounterMode);
  }

  clearLocalStorage(): void {
    [
      this.STORAGE_KEY_PLAYERS,
      this.STORAGE_KEY_GAMESTARTED,
      this.STORAGE_KEY_STARTPLAYER,
      this.STORAGE_KEY_CURRPLAYERTURN,
      this.STORAGE_KEY_7FLIPCOUNTERMODE,
    ].forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  private setGameStarted(started: boolean): void {
    this._isGameStarted.set(started);
  }

  private loadAllPlayerFromStorage(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_PLAYERS);
    let loadPlayers = [];

    if (!load || load === 'undefined') {
      return;
    }

    try {
      loadPlayers = JSON.parse(load);
    } catch (e) {
      console.error('Fehler beim Parsen des JSON-Strings:', e);
    }
    this._players.set(loadPlayers);
  }

  private loadStartPlayer(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_STARTPLAYER);
    this._startPlayer.set(load ? JSON.parse(load) : undefined);
  }

  private loadCurrentPlayerTurn(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_CURRPLAYERTURN);
    this._currentPlayerTurn.set(load ? JSON.parse(load) : 0);
  }

  private loadGameStarted(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_GAMESTARTED);
    this._isGameStarted.set(load ? JSON.parse(load) : false);
  }

  private load7FlipCounterMode(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_7FLIPCOUNTERMODE);
    this._is7FlipCounterMode.set(load ? JSON.parse(load) : true);
  }

  private generateUniqueId(): string {
    let id: string;

    do {
      id = crypto.randomUUID();
    } while (this._players().some((player) => player.id === id));

    return id;
  }
}
