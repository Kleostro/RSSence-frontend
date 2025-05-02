import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-page-loader',
  imports: [ProgressSpinner],
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PageLoaderComponent {}
