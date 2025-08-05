import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  selector: 'app-moderator-layout',
  styleUrl: './moderator-layout.component.scss',
  templateUrl: './moderator-layout.component.html',
})
export class ModeratorLayoutComponent {}
