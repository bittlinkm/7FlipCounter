import {Component, inject, OnDestroy} from '@angular/core';
import {DisplayPlayerComponent} from '../display-player/display-player.component';
import {PlayerService} from '../../services/player.service';

@Component({
  selector: 'app-content',
  imports: [DisplayPlayerComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  standalone: true
})
export class ContentComponent implements OnDestroy {
 playerService = inject(PlayerService);

  ngOnDestroy() {
    this.playerService.clearLocalStorage();
  }

}
