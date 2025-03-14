import {Injectable, OnInit, Signal, signal} from '@angular/core';
import {Player} from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit{
  private readonly STORAGE_KEY_PLAYERS = 'players';
  private readonly STORAGE_KEY_GAMESTARTED = 'gamestarted';
  private readonly STORAGE_KEY_STARTPLAYER = 'startplayer';
  private readonly STORAGE_KEY_CURRPLAYERTURN = 'currplayerturn';
  private readonly STORAGE_KEY_DEFAULTCOUNTERMODE = 'defaultcountermode'
  private readonly goalScore : number = 200;
  private players: Player[] = [];
  private defaultCounterMode = signal<boolean>(true);
  private gameStarted = signal<boolean>(false);
  private startPlayer = signal<Player | undefined >(undefined);
  private currentPlayerTurn = signal<number>(0);

  ngOnInit(): void {
    this.loadAllPlayerFromStorage();
    this.loadGameStarted();
    this.loadStartPlayer();
    this.loadCurrentPlayerTurn();
    this.loadDefaultCounterMode();
  }

  getAllPlayer(): Player[] {
    return this.players;
  }

  getPlayer(playerId: string): Player {
    const currentPlayer = this.players.find( x => x.id === playerId );
    if (!currentPlayer) {
      throw new Error(`Player with id ${playerId} not found in local storage.`);
    }
    return currentPlayer;
  }

  getCurrentPlayerTurn(): Signal<number> {
    return this.currentPlayerTurn.asReadonly();
  }

  getPlayerScore(playerId: string): number {
    const currentPlayer = this.getPlayer(playerId);
    return  currentPlayer.score.reduce((sum: number, s:number) => sum + s, 0);
  }

  getWinner(): Player[] | Player {
    const winners = this.players.filter( player => this.getPlayerScore(player.id) >= this.goalScore);

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

    return  winners.filter(player => this.getPlayerScore(player.id) === highestScore);
  }

  setStartPlayer(player: Player): void {
    this.startPlayer.set(player);
    localStorage.setItem(this.STORAGE_KEY_STARTPLAYER, JSON.stringify(this.startPlayer()));
  }

  setCurrentPlayerTurn(nextPosition: number): void {
    this.currentPlayerTurn.set(nextPosition);
    localStorage.setItem(this.STORAGE_KEY_CURRPLAYERTURN, JSON.stringify(this.currentPlayerTurn()));
  }

  isGameStarted(): Signal<boolean> {
    return this.gameStarted.asReadonly();
  }

  isGameFinished(): boolean {
    if(this.isDefaultCounterMode()){
      const winner = this.players.filter(
        (player: Player) => this.getPlayerScore(player.id) >= this.goalScore);

      return winner.length > 0
    }
    return false
  }

  isDefaultCounterMode(): boolean {
    return this.defaultCounterMode();
  }

  nextPlayerTurn(): void {
    const nextPosition = this.currentPlayerTurn() >= this.players.length ? 1 : this.currentPlayerTurn() + 1;
    this.setCurrentPlayerTurn(nextPosition)
  }

  newGame(selectedPlayer: Player): void {
    this.players.forEach((player: Player): void => {
      player.score = player.score.map(()=> 0);
    });
    this.saveAllPlayerToStorage();
    this.setGameStated(true)

    this.setStartPlayer(selectedPlayer);
    this.setCurrentPlayerTurn(selectedPlayer.position);

    if (this.currentPlayerTurn() === 0) {
      this.currentPlayerTurn.set(1);
    }
  }

  createPlayer(name: string): void{
    const position = this.players.length +1;
    const newPlayer: Player = {
      id: this.generateUniqueId(),
      position: position,
      name,
      score: []
    };

    this.players.push(newPlayer);
    this.saveAllPlayerToStorage();
  }

  updatePlayerScore(playerId: string, roundScore: number): void {
    const currentPlayer = this.getPlayer(playerId);
    currentPlayer.score.push(roundScore);

    const playerIndex = this.players.findIndex(player => player.id === playerId);
    if (playerIndex > -1) {
      this.players[playerIndex] = currentPlayer;
    }
    this.saveAllPlayerToStorage();
  }

  deletePlayer(player: Player) {
    const index = this.players.indexOf(player);
    if(index <= -1) {
      console.log('Spieler konnte nicht gelöscht werden. Index zu klein!')
      return;
    }

    const data = this.players;
    data.splice(index, 1);
    this.players = [...data];

    this.players.forEach((item,index): void => {
      item.position = index + 1;
    })

    this.updatePlayerPosition();
    this.saveAllPlayerToStorage();
  }

  updatePlayerPosition(): void{
    this.players.forEach((item,index): void => {
      item.position = index + 1;
    })
  }

  setDefaultCounterMode(defaultCounterMode: boolean) {
    this.defaultCounterMode.set(defaultCounterMode);
    localStorage.setItem(this.STORAGE_KEY_DEFAULTCOUNTERMODE,JSON.stringify(this.defaultCounterMode()));
  }

  clearLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY_PLAYERS);
  }

  private setGameStated(started: boolean): void {
    this.gameStarted.set(started);
    localStorage.setItem(this.STORAGE_KEY_GAMESTARTED, JSON.stringify(this.gameStarted()));
  }

  private loadAllPlayerFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY_PLAYERS);
    this.players = saved ? JSON.parse(saved) : [];
  }

  private loadStartPlayer(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_STARTPLAYER);
    this.startPlayer.set(load ? JSON.parse(load) : undefined);
  }

  private loadCurrentPlayerTurn(): void {
    const load = localStorage.getItem(this.STORAGE_KEY_CURRPLAYERTURN);
    this.currentPlayerTurn.set(load ? JSON.parse(load) : 0);
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
      id = crypto.randomUUID()
    } while (this.players.some(player => player.id === id));

    return id;
  }
}

