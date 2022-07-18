import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Observable<any> {
    return this.http.post(
      'http://localhost:8080/login',
      JSON.stringify({ "username": username, "password" : password }),
      {
      responseType: 'text',
      observe: 'response'
    });
  }

  public askForRefreshToken(refreshToken: string): Observable<any> {
    return this.http.get<any>('http://localhost:8080/token/refresh', {
      headers: {
        'Authorization': refreshToken
      },
      observe: 'response'
    });
  }

}
