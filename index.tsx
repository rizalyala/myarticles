import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { ErrorHandler, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './src/app/app.component';
import { appRoutes } from './src/app/app.routes';
import { GlobalErrorHandler } from './src/services/global-error-handler.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(appRoutes, withHashLocation()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types।

// AI Studio always uses an `index.tsx` file for all project types.