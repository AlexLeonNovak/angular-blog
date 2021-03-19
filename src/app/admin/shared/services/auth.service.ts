import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {User} from "../../../shared/interfaces";
import {Observable, Subject, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {FirebaseAuthResponse} from "../../../shared/interfaces";

@Injectable({providedIn: "root"})
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string | null {
    const expDate = localStorage.getItem('firebase-token-exp');
    if (expDate && new Date() > new Date(expDate)) {
      this.logout();
      return null;
    }
    return localStorage.getItem('firebase-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post<FirebaseAuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  private setToken(response: FirebaseAuthResponse | null): void {
    if (response) {
      const expDate = new Date(new Date().getTime() + Number(response.expiresIn) * 1000);
      localStorage.setItem('firebase-token', response.idToken);
      localStorage.setItem('firebase-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  private handleError(error: HttpErrorResponse): Observable<string>
  {
    const {message} = error.error.error;

    switch (message) {
      case 'EMAIL_NOT_FOUND' :
        this.error$.next('Email not found');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password');
        break;
      case 'USER_DISABLED':
        this.error$.next('User disabled');
        break;
    }

    return throwError(error);
  }
}
