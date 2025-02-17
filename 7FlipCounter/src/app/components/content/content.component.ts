import { Component } from '@angular/core';
import {DisplayPlayerComponent} from '../display-player/display-player.component';

@Component({
  selector: 'app-content',
  imports: [DisplayPlayerComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  standalone: true
})
export class ContentComponent {

}
