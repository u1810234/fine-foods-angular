import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IUserResponceModel } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.httpClient
      .post<IUserResponceModel>(`${environment.api}users/login`, credentials)
      .pipe(
        catchError((error) => {
          return throwError(() => error.error);
        }),
        tap((res: IUserResponceModel) => this.setSession(res))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
  }

  isUserLoggedIn(): boolean {
    return new Date().getTime() < Number(localStorage.getItem('expiresAt'));
  }

  register(credentials: { name: string; email: string; password: string }) {
    return this.httpClient
      .post<IUserResponceModel>(`${environment.api}users/register`, credentials)
      .pipe(
        catchError((error) => {
          return throwError(() => error.error);
        }),
        tap((res) => this.setSession(res))
      );
  }

  private setSession(loginResult: any): void {
    localStorage.setItem('token', loginResult.data.token);
    let tokenTime = JSON.parse(atob(loginResult.data.token.split('.')[1]));
    tokenTime = tokenTime.exp * 1000;
    localStorage.setItem('expiresAt', tokenTime.toString());
  }
}
