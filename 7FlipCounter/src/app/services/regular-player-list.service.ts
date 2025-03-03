import { Injectable } from '@angular/core';
import {regularPlayerList} from '../config/regular-player-list';
import {RegularPlayerItem} from '../models/regularPlayerItem';

@Injectable({
  providedIn: 'root'
})
export class RegularPlayerListService {

  constructor() { }

  getRegularPlayerList(): RegularPlayerItem[] {
    return this.sortListAlphabetical(regularPlayerList);
  }

  private sortListAlphabetical(unsortedList: RegularPlayerItem[]): RegularPlayerItem[] {
    return unsortedList.sort((a,b) => a.name.localeCompare(b.name));
  }
}

