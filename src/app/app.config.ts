import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { errorInterceptor } from '@/app/api/interceptors/error-interceptor';
import { httpInterceptor } from '@/app/api/interceptors/http-interceptor';
import { routes } from '@/app/app.routes';
import { MyPreset } from '@/app/utils/my-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    MessageService,
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withInterceptors([errorInterceptor, httpInterceptor])),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          cssLayer: false,
          darkModeSelector: '.app-dark',
        },
      },
      ripple: true,
    }),
  ],
};
