import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.warn("INTERCEPTOR CALL");

    if(localStorage.getItem('access_token') != null) {
      this.authenticationService.setIsLoggedIn();
    }

    if (this.authenticationService.getIsLoggedIn()) {
      let parsedToken = JSON.parse(localStorage.getItem('access_token') || '{}');

      console.warn(this.authenticationService.getRolesOfAccessToken());

      const reqWithAuthToken = req.clone({
        setHeaders: {
          'Authorization': parsedToken.token
        }
      });
      return next.handle(reqWithAuthToken);
    }
    return next.handle(req);
  }
}
