import {Injectable} from '@angular/core';
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  accessToken: string = '';
  refreshToken: string = '';

  constructor(private loginService: LoginService) { }

  login(username: string, password: string): void {
    this.loginService.login(username, password).subscribe(response => {
      let tokensJson = JSON.parse(response.body);

      this.accessToken = 'Bearer ' + tokensJson.access_token;
      this.refreshToken = 'Bearer ' + tokensJson.refresh_token;

      localStorage.setItem('access_token', this.accessToken);
      localStorage.setItem('refresh_token', this.refreshToken);
    });
  }

}
