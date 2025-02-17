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

  updatePlayerScore(id: string, score: number): void {
    const player = this.getPlayerFromLocalStorage(id);
    player.score.push(score);

    localStorage.setItem(player.id, JSON.stringify(player));
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

