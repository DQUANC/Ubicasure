import { Injectable } from '@angular/core';

/**
 * In-memory token and identity storage.
 * Replaces localStorage to reduce XSS attack surface.
 * Token is lost on page refresh — acceptable for this application.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  private token: string = '';
  private identity: any = null;

  getToken(): string {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = '';
  }

  getIdentity(): any {
    return this.identity;
  }

  setIdentity(identity: any): void {
    this.identity = identity;
  }

  clearIdentity(): void {
    this.identity = null;
  }

  clearAll(): void {
    this.token = '';
    this.identity = null;
  }
}
