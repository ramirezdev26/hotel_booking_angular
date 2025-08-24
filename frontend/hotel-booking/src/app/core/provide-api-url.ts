import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import { API_URL } from './api-url-token';

export function provideApiUrl({ url }: { url: string }): EnvironmentProviders {
  const providers: Provider[] = [{ provide: API_URL, useValue: url }];

  return makeEnvironmentProviders(providers);
}
