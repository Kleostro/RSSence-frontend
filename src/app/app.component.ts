import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TuiRoot } from '@taiga-ui/core';

import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppComponent {}
