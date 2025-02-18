import { Injectable } from '@angular/core';
import {Player} from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerIds: Set<string> = new Set();

  createPlayer(name: string): Player {
    const player: Player = {
      id: this.generateUniqueId(),
      position: Math.random(),
      name,
      score: []
    };

    localStorage.setItem(player.id, JSON.stringify(player));
    return player;
  }

  getPlayerFromLocalStorage(id: string): Player {
    const playerJson: string | null = localStorage.getItem(id);

    if (!playerJson) {
      throw new Error(`Player with id ${id} not found in local storage.`);
    }

    return JSON.parse(playerJson);
  }

  getAllPlayersFromLocalStorage(): Player[] {
    const currentPlayers: Player[] = [];

    this.playerIds.forEach( playerId => {
      const playerJson = localStorage.getItem(playerId);
      if(playerJson) {
        const currentPlayer: Player = JSON.parse(playerJson);
        currentPlayers.push(currentPlayer);

      } else {
        console.log('No player' + playerId + 'found in local storage');
      }
    });
    return currentPlayers;
  }

  getPlayerScore(playerId: string): number {
    const playerJson: string | null = localStorage.getItem(playerId);
    if (!playerJson) {
      throw new Error(`Player with id ${playerId} not found in local storage.`);
    }

    const currentPlayer = JSON.parse(playerJson);
    return currentPlayer.score.reduce((sum: number, s:number) => sum + s, 0);
  }

  updatePlayerScore(id: string, score: number): void {
    const player = this.getPlayerFromLocalStorage(id);
    player.score.push(score);

    localStorage.setItem(player.id, JSON.stringify(player));
  }

  deletePlayerFromLocalStorage(playerId: string): void {
    const playerJson: string | null = localStorage.getItem(playerId);

    if (!playerJson) {
      throw new Error(`Player with id ${playerId} not found in local storage.`);
    }
    localStorage.removeItem(playerId);
    this.deletePlayerIdFromLocalIds(playerId);
  }

  private deletePlayerIdFromLocalIds(playerId: string): void {
    this.playerIds.delete(playerId);
  }

  private generateUniqueId(): string {
    let id: string;

    do {
      id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    } while (this.playerIds.has(id));

    this.playerIds.add(id);
    this.saveIdsToLocalStorage();
    return id;
  }

  private saveIdsToLocalStorage(): void {
    const idsArray = Array.from(this.playerIds);
    localStorage.setItem('playerIds', JSON.stringify(idsArray));
  }

  clearLocalStorage(): void {
    localStorage.removeItem('playerIds');

    this.playerIds.forEach( playerId => {
      if(localStorage.getItem(playerId)){
        localStorage.removeItem(playerId);
      } else {
        console.log('No player' + playerId + 'found in local storage');
      }
    });
  }
}

