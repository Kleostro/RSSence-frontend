import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';

import { HeaderComponent } from '@/app/core/components/header/header.component';
import { SidebarComponent } from '@/app/core/components/sidebar/sidebar.component';
import { LoaderService } from '@/app/core/services/loader/loader.service';
import { ModalComponent } from '@/app/shared/components/modal/modal.component';
import { PageLoaderComponent } from '@/app/shared/components/page-loader/page-loader.component';
import { configurePostMarked } from '@/app/utils/configure-post-marked';

@Component({
  imports: [RouterOutlet, HeaderComponent, ToastModule, ModalComponent, PageLoaderComponent, SidebarComponent],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly primeng = inject(PrimeNG);
  public readonly loaderService = inject(LoaderService);

  public ngOnInit(): void {
    this.primeng.ripple.set(true);
    configurePostMarked();
  }
}
