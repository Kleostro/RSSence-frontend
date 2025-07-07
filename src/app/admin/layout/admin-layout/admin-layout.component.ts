import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.component.scss',
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {}
