import { Injectable } from '@angular/core';
import {regularNameList} from '../config/regular-name-list';
import {RegularNameItem} from '../models/regularNameItem';

@Injectable({
  providedIn: 'root'
})
export class RegularNameListService {

  constructor() { }

  getRegularNameList(): RegularNameItem[] {
    return regularNameList;
  }

  //Todo: Sort List by Name
}
