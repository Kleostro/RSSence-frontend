import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '@/app/auth/services/auth/auth.service';
import { HeaderComponent } from '@/app/core/components/header/header.component';
import { ModalComponent } from '@/app/shared/components/modal/modal.component';

@Component({
  imports: [RouterOutlet, HeaderComponent, ToastModule, ModalComponent],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly primeng = inject(PrimeNG);

  public ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.authService.checkAuth();
  }
}
