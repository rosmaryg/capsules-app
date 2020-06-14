import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BackendService} from '../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private backendService: BackendService
  ) {

  }

  login(code: string, href: string) {
    this.backendService.getAccessToken(code)
      .subscribe((data: any) => {
        this.setSession(data);
        window.location.href = href;
      });
  }

  private setSession(authResult) {
    localStorage.setItem('access_token', authResult.access_token);
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public isLoggedIn() {
    return (localStorage.getItem('access_token') !== null);
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
