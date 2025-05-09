import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {importProvidersFrom, isDevMode} from '@angular/core';
import {ServiceWorkerModule} from '@angular/service-worker';

const config = {
  ...appConfig,
  providers: [
    ...appConfig.providers ?? [],
    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'


      })
    )
  ]
};

bootstrapApplication(AppComponent, config)
  .catch((err) => console.error(err));
