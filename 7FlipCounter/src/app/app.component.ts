import { Component, inject } from '@angular/core';
import { ContentComponent } from './feature/7flip/content/content.component';
import { UpdateService } from './core/services/update.service';

@Component({
  selector: 'app-root',
  imports: [ContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = '7FlipCounter';
  readonly updateService = inject(UpdateService);
}
