import { Injectable } from '@angular/core';
import {regularNameList} from '../config/regular-name-list';
import {RegularNameItem} from '../models/regularNameItem';

@Injectable({
  providedIn: 'root'
})
export class RegularNameListService {

  constructor() { }

  getRegularNameList(): RegularNameItem[] {
    return this.sortListAlphabetical(regularNameList);
  }

  private sortListAlphabetical(unsortedList: RegularNameItem[]): RegularNameItem[] {
    return unsortedList.sort((a,b) => a.name.localeCompare(b.name));
  }
}
