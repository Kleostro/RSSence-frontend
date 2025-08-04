import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-forbidden',
  styleUrl: './forbidden.component.scss',
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent {}
