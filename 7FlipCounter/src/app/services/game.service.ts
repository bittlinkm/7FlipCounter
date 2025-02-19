import { Injectable } from '@angular/core';
import {Player} from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly STORAGE_KEY = 'players';
  private players: Player[] = [];

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

  saveAllPlayerToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.players));
  }

  getAllPlayerFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.players = saved ? JSON.parse(saved) : [];
  }

  getPlayerScore(playerId: string): number {
    const currentPlayer = this.getPlayer(playerId);
    return  currentPlayer.score.reduce((sum: number, s:number) => sum + s, 0);
  }

  updatePlayerScore(playerId: string, roundScore: number): void {
    const currentPlayer = this.getPlayer(playerId);
    currentPlayer.score.push(roundScore);
    this.saveAllPlayerToStorage();
  }

  newGame(): void {
    this.players.forEach((player: Player): void => {
      player.score = player.score.map(()=> 0);
    });
    this.saveAllPlayerToStorage();
  }

  deletePlayerFromStorage(position: number): void {
    this.players.splice(position, 1);
    this.saveAllPlayerToStorage();
  }

  clearLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateUniqueId(): string {
    let id: string;

    do {
      id = crypto.randomUUID()
    } while (this.players.some(player => player.id === id));

    return id;
  }
}

