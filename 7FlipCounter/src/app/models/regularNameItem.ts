import {BaseModel} from './base-model';

export interface RegularNameItem extends BaseModel{
  name: string;
  selected?: boolean;
}
