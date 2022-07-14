import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    console.warn("Auth Guard: Is Logged In: " + this.authenticationService.getIsLoggedIn());

    //LOGGED IN USERS
    if(this.authenticationService.getIsLoggedIn()) {
      //DISABLE LOG IN
      if (route.routeConfig?.path === 'login') {
        return false;
      }

      //ADMIN
      if (this.authenticationService.getRolesOfAccessToken().includes("ROLE_ADMIN")) {
        //Default Route
        if (route.routeConfig?.path === '') {
          this.router.navigate(['admin']);
        }

        //Allowed Access - administration
        if (route.routeConfig?.path === 'admin') {
          return true;
        }
      }

      //USER
      if (this.authenticationService.getRolesOfAccessToken().includes("ROLE_USER")) {
        //Default Route
        if (route.routeConfig?.path === '') {
          this.router.navigate(['home']);
        }

        //Allowed Access - home
        if (route.routeConfig?.path === 'home') {
          return true;
        }
      }

      //ALL LOGGED IN ACCOUNTS
      if (route.routeConfig?.path === 'profile') {
        return true;
      }

      return false;
    }

    //Unlogged users
    else {
      //Default Route
      if (route.routeConfig?.path === '') {
        this.router.navigate(['home']);
      }

      //Allowed access - home
      if (route.routeConfig?.path === 'home') {
        return true;
      }

      //Allowed access - login
      if (route.routeConfig?.path === 'login') {
        return true;
      }

      //Allowed access - register
      if (route.routeConfig?.path === 'register') {
        return true;
      }

      return false;
    }
  }
}
