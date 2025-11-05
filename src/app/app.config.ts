import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { Observable, switchMap } from 'rxjs';

import { httpInterceptor } from '@/app/api/interceptors/http-interceptor';
import { refreshInterceptor } from '@/app/api/interceptors/refresh-interceptor';
import { UserResponse } from '@/app/api/schemas/users-response';
import { RolesService } from '@/app/api/services/roles/roles.service';
import { routes } from '@/app/app.routes';
import { AuthService } from '@/app/auth/services/auth/auth.service';
import { ThemeSwitchService } from '@/app/core/services/theme-switch/theme-switch.service';
import { MyPreset } from '@/app/utils/my-preset';

const appInitializer = (): Observable<null | UserResponse> => {
  const authService = inject(AuthService);
  const rolesService = inject(RolesService);
  const themeSwitchService = inject(ThemeSwitchService);
  themeSwitchService.initAppTheme();
  return rolesService.getRoleHierarchy().pipe(switchMap(() => authService.checkAuth()));
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideAppInitializer(appInitializer),
    MessageService,
    ThemeSwitchService,
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([httpInterceptor, refreshInterceptor])),
    providePrimeNG({
      ripple: true,
      theme: {
        options: {
          cssLayer: false,
          darkModeSelector: '.app-dark',
        },
        preset: MyPreset,
      },
    }),
  ],
};
