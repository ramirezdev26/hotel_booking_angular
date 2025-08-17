import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideKeycloak } from 'keycloak-angular';

import { routes } from './app.routes';
import { provideApiUrl } from './core/provide-api-url';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideApiUrl({ url: 'http://localhost:3000' }),
    provideKeycloak({
      config: {
        url: 'http://localhost:8080/',
        realm: 'hotel-booking',
        clientId: 'public-client'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      }
    })
  ]
};
