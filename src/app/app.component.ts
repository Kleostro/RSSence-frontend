import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';

import { HeaderComponent } from '@/app/core/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly primeng = inject(PrimeNG);

  public ngOnInit(): void {
    this.primeng.ripple.set(true);
  }
}
