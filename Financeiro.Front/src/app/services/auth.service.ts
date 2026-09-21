import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'fin_token';

  login(username: string, password: string) {
    // mock: admin/admin
    if ((username === 'admin' && password === 'admin') || (username === 'usuario' && password === 'usuario')) {
      localStorage.setItem(this.key, JSON.stringify({ username }));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.key);
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.key);
  }
}
