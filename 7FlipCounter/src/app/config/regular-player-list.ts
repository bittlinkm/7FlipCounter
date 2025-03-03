import {RegularPlayerItem} from '../models/regularPlayerItem';

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

 //TODO: move to service
export const regularPlayerList: RegularPlayerItem[] = names.map((name, index) => ({
  id: (index + 1).toString(),
  name,
  selected: false
}));
