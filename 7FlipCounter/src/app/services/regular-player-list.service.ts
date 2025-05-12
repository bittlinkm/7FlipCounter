import { Injectable, signal } from '@angular/core';
import { Player } from '../models/player';
import { regularPlayer } from '../config/regular-player-list';

@Injectable({
  providedIn: 'root',
})
export class RegularPlayerListService {
  regularPlayerList = signal<Player[]>([]);

  constructor() {
    this.regularPlayerList.set(
      regularPlayer.map((name, index) => {
        return {
          id: (index + 1).toString(),
          name: name,
          position: index + 1,
          score: [],
          isActive: false,
          selected: false,
        };
      }),
    );
  }

  getRegularPlayerList(): Player[] {
    return this.sortListAlphabetical(this.regularPlayerList());
  }

  private sortListAlphabetical(unsortedList: Player[]): Player[] {
    return unsortedList.sort((a, b) => a.name.localeCompare(b.name));
  }
}
