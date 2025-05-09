import { Injectable, Signal, signal } from '@angular/core';
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
  private readonly STORAGE_KEY_DEFAULTCOUNTERMODE = 'defaultcountermode';
  private readonly goalScore: number = 200;
  private _players = signal<Player[]>([]);
  readonly players = this._players.asReadonly();
  private defaultCounterMode = signal<boolean>(true);
  private gameStarted = signal<boolean>(false);
  private startPlayer = signal<Player | undefined>(undefined);
  private _currentPlayerTurn = signal<number>(0);
  readonly currentPlayerTurn = this._currentPlayerTurn.asReadonly();

  constructor() {
    this.initNewGame();
  }

  initNewGame(): void {
    this.loadAllPlayerFromStorage();
    this.loadGameStarted();
    this.loadStartPlayer();
    this.loadCurrentPlayerTurn();
    this.loadDefaultCounterMode();
  }

  getPlayerById(playerId: string): Player {
    const currentPlayer = this._players().find((x) => x.id === playerId);
    if (!currentPlayer) {
      throw new Error(`Player with id ${playerId} not found in local storage.`);
    }
    return currentPlayer;
  }

  getCurrentPlayerTurn(): Signal<number> {
    return this._currentPlayerTurn.asReadonly();
  }

  getPlayerScore(playerId: string): number {
    const currentPlayer = this.getPlayerById(playerId);
    return currentPlayer.score.reduce((sum: number, s: number) => sum + s, 0);
  }

  getWinner(): Player[] | Player {
    const winners = this._players().filter((player) => this.getPlayerScore(player.id) >= this.goalScore);

    if (winners.length === 0) {
      return [];
    }

    if (winners.length === 1) {
      return winners[0];
    }

    let highestScore = 0;
    for (const player of winners) {
      const score = this.getPlayerScore(player.id);
      if (score > highestScore) {
        highestScore = score;
      }
    }

    return winners.filter((player) => this.getPlayerScore(player.id) === highestScore);
  }

  setStartPlayer(player: Player): void {
    this.startPlayer.set(player);
    localStorage.setItem(this.STORAGE_KEY_STARTPLAYER, JSON.stringify(this.startPlayer()));
  }

  setCurrentPlayerTurn(nextPosition: number): void {
    this._currentPlayerTurn.set(nextPosition);
    localStorage.setItem(this.STORAGE_KEY_CURRPLAYERTURN, JSON.stringify(this.currentPlayerTurn()));
  }

  isGameStarted(): Signal<boolean> {
    return this.gameStarted.asReadonly();
  }

  isGameFinished(): boolean {
    if (this.isDefaultCounterMode()) {
      const winner = this._players().filter((player: Player) => this.getPlayerScore(player.id) >= this.goalScore);

      return winner.length > 0;
    }
    return false;
  }

  isDefaultCounterMode(): boolean {
    return this.defaultCounterMode();
  }

  nextPlayerTurn(): void {
    const nextPosition = this.currentPlayerTurn() >= this.players.length ? 1 : this.currentPlayerTurn() + 1;
    this.setCurrentPlayerTurn(nextPosition);
  }

  newGame(selectedPlayer?: Player): void {
    if (selectedPlayer) {
      this.newGameWithSamePlayers(selectedPlayer);
    } else {
      this.newEmptyGame();
    }
  }

  newGameWithSamePlayers(selectedPlayer: Player) {
    this._players().forEach((player: Player): void => {
      player.score = player.score.map(() => 0);
    });
    this.saveAllPlayerToStorage();
    this.setGameStated(true);

    this.setStartPlayer(selectedPlayer);
    this.setCurrentPlayerTurn(selectedPlayer.position);

    if (this.currentPlayerTurn() === 0) {
      this._currentPlayerTurn.set(1);
    }
  }

  newEmptyGame() {
    this.clearLocalStorage();
    this.initNewGame();
  }

  createPlayer(name: string): void {
    const position = this.players.length + 1;
    const newPlayer: Player = {
      id: this.generateUniqueId(),
      position: position,
      name,
      score: [],
    };

    this._players().push(newPlayer);
    this._players.set([...this.players()]);
    //this._players.update((players) => [...this.players()]);
    this.saveAllPlayerToStorage();
  }

  updatePlayerScore(playerId: string, roundScore: number): void {
    const currentPlayer = this.getPlayerById(playerId);
    currentPlayer.score.push(roundScore);

    const playerIndex = this._players().findIndex((player) => player.id === playerId);
    if (playerIndex > -1) {
      this._players()[playerIndex] = currentPlayer;
    }
    this.saveAllPlayerToStorage();
  }

  deletePlayer(player: Player) {
    const index = this._players().indexOf(player);
    if (index <= -1) {
      console.log('Spieler konnte nicht gelöscht werden. Index zu klein!');
      return;
    }

    const data = this._players();
    data.splice(index, 1);
    this._players.set([...data]);

    this._players().forEach((item, index): void => {
      item.position = index + 1;
    });

    this.updatePlayerPosition();
    this.saveAllPlayerToStorage();
  }

  updatePlayerPosition(): void {
    this._players().forEach((item, index): void => {
      item.position = index + 1;
    });
  }

  updatePlayerName(player: Player, newName: string): void {
    const playerToUpdate = this._players().find((p) => p.id === player.id);
    if (playerToUpdate) {
      playerToUpdate.name = newName;
    }
    this.saveAllPlayerToStorage();
  }

  movePlayerPosition(previousIndex: number, currentIndex: number): void {
    if (previousIndex !== currentIndex) {
      moveItemInArray(this._players(), previousIndex, currentIndex);
      this.updatePlayerPosition();
      this._players.set([...this._players()]);
    }
    this.saveAllPlayerToStorage();
  }

  setDefaultCounterMode(defaultCounterMode: boolean) {
    this.defaultCounterMode.set(defaultCounterMode);
    localStorage.setItem(this.STORAGE_KEY_DEFAULTCOUNTERMODE, JSON.stringify(this.defaultCounterMode()));
  }

  clearLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY_PLAYERS);
    localStorage.removeItem(this.STORAGE_KEY_GAMESTARTED);
    localStorage.removeItem(this.STORAGE_KEY_STARTPLAYER);
    localStorage.removeItem(this.STORAGE_KEY_CURRPLAYERTURN);
    localStorage.removeItem(this.STORAGE_KEY_DEFAULTCOUNTERMODE);
  }

  private setGameStated(started: boolean): void {
    this.gameStarted.set(started);
    localStorage.setItem(this.STORAGE_KEY_GAMESTARTED, JSON.stringify(this.gameStarted()));
  }

  private loadAllPlayerFromStorage(): void {
    let load = localStorage.getItem(this.STORAGE_KEY_PLAYERS);
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
    this.startPlayer.set(load ? JSON.parse(load) : undefined);
  }

  private loadCurrentPlayerTurn(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_CURRPLAYERTURN);
    this._currentPlayerTurn.set(load ? JSON.parse(load) : 0);
  }

  private loadGameStarted(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_GAMESTARTED);
    this.gameStarted.set(load ? JSON.parse(load) : false);
  }

  private loadDefaultCounterMode(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_DEFAULTCOUNTERMODE);
    this.defaultCounterMode.set(load ? JSON.parse(load) : false);
  }

  private saveAllPlayerToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY_PLAYERS, JSON.stringify(this.players));
  }

  private generateUniqueId(): string {
    let id: string;

    do {
      id = crypto.randomUUID();
    } while (this._players().some((player) => player.id === id));

    return id;
  }
}
