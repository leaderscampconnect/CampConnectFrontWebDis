import { Injectable, signal } from '@angular/core';
import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';

interface CampConnectToken extends KeycloakTokenParsed {
  preferred_username?: string;
  name?: string;
  realm_access?: {
    roles: string[];
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = new Keycloak({
    url: `${window.location.protocol}//${window.location.hostname}:8180`,
    realm: 'campconnect',
    clientId: 'campconnect-web'
  });

  readonly authenticated = signal(false);
  readonly username = signal('Guest');
  readonly roles = signal<string[]>([]);
  readonly initializationError = signal('');

  async initialize(): Promise<void> {
    try {
      await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256'
      });
      this.syncState();
      this.keycloak.onAuthSuccess = () => this.syncState();
      this.keycloak.onAuthLogout = () => this.syncState();
      this.keycloak.onTokenExpired = () => {
        void this.keycloak.updateToken(30).then(() => this.syncState());
      };
    } catch {
      this.initializationError.set(
        'Authentication is temporarily unavailable. Public events remain accessible.'
      );
      this.syncState();
    }
  }

  login(): Promise<void> {
    return this.keycloak.login({ redirectUri: window.location.href });
  }

  logout(): Promise<void> {
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  token(): string | undefined {
    return this.keycloak.token;
  }

  userId(): string | undefined {
    const token = this.keycloak.tokenParsed as CampConnectToken | undefined;
    return token?.sub;
  }

  hasAnyRole(...expectedRoles: string[]): boolean {
    const currentRoles = this.roles();
    return expectedRoles.some(role => currentRoles.includes(role.toUpperCase()));
  }

  private syncState(): void {
    const token = this.keycloak.tokenParsed as CampConnectToken | undefined;
    this.authenticated.set(Boolean(this.keycloak.authenticated));
    this.username.set(token?.name ?? token?.preferred_username ?? 'Guest');
    this.roles.set((token?.realm_access?.roles ?? []).map(role => role.toUpperCase()));
  }
}
