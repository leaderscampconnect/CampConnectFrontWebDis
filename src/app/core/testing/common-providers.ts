import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

export const commonTestingProviders: Array<Provider | EnvironmentProviders> = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([])
];
