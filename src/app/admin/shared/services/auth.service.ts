import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../../shared/interfaces";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {tap} from "rxjs/operators";
import {FirebaseAuthResponse} from "../../../shared/interfaces";

@Injectable()
export class AuthService {

  private API_KEY = 'AIzaSyCOqPpPi5e2b6FShN9nLlNbeSDqQ5GGjBA';

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
        tap(this.setToken)
      );
  }

  logout() {
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
}
