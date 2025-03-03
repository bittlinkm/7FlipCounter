import {RegularNameItem} from '../models/regularNameItem';

 const names: string[] = [
  'Günter',
  'Sandra',
  'Mario',
  'Richard',
  'Doris',
  'Sabrina',
  'Sascha',
  'Manuela',
  'Raphi',
  'Petra',
  'Oli',
  'Anna'
];

export const regularNameList: RegularNameItem[] = names.map((name, index) => ({
  id: (index + 1).toString(),
  name,
  selected: false
}));
