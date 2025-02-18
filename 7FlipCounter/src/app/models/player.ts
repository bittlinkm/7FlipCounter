import {BaseModel} from './base-model';

export interface Player extends BaseModel {
  position: number;
  name: string;
  score: number[];
  [key: string]: any;
}
