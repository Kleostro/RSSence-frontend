import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressSpinner],
  selector: 'app-page-loader',
  styleUrl: './page-loader.component.scss',
  templateUrl: './page-loader.component.html',
})
export class PageLoaderComponent {}
