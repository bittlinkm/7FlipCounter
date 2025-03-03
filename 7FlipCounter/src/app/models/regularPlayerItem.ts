import {BaseModel} from './base-model';

export interface RegularPlayerItem extends BaseModel{
  name: string;
  selected?: boolean;
}
// TODO: delete and use Player
