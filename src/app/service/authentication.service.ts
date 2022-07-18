import {Injectable} from '@angular/core';
import {LoginService} from "./login.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  accessToken: string = '';
  refreshToken: string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  login(username: string, password: string): void {
    this.loginService.login(username, password).subscribe(response => {
      let tokensJson = JSON.parse(response.body);

      this.accessToken = 'Bearer ' + tokensJson.access_token;
      this.refreshToken = 'Bearer ' + tokensJson.refresh_token;

      localStorage.setItem('access_token', JSON.stringify({ "token": this.accessToken }));
      localStorage.setItem('refresh_token', JSON.stringify({"token": this.refreshToken }));

      this.router.navigate(['']);
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/home']);
  }

  getIsLoggedIn(): boolean {
    return localStorage.getItem('access_token') != null;
  }

  getRolesOfAccessToken(): any {
    if (!this.getIsLoggedIn()) {
      return [{}];
    }

    let accessToken = JSON.parse(localStorage.getItem('access_token') || '{}').token.substring("Bearer ".length);

    let jwtData = accessToken.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    return decodedJwtData.roles;
  }

  getUsernameOfAccessToken(): any {
    if (!this.getIsLoggedIn()) {
      return [{}];
    }

    let accessToken = JSON.parse(localStorage.getItem('access_token') || '{}').token.substring("Bearer ".length);

    let jwtData = accessToken.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    return decodedJwtData.sub;
  }

  useRefreshToken(): void {
    let originalRefreshToken = JSON.parse(localStorage.getItem('refresh_token') || '{}').token;
    let refreshToken = originalRefreshToken.substring("Bearer ".length);

    let jwtData = refreshToken.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    if(Math.floor(new Date().getTime() / 1000) >= decodedJwtData.exp) { //timestamp in seconds
      this.logout();
      this.router.navigate(['/login']);
      return;
    }

    localStorage.removeItem('access_token');

    this.loginService.askForRefreshToken(originalRefreshToken).subscribe(response => {
      this.accessToken = 'Bearer ' + response.body.access_token;

      localStorage.setItem('access_token', JSON.stringify({ "token": this.accessToken }));

      window.location.reload();
    });
  }
}
