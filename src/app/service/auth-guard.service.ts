import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {isString} from "@ng-bootstrap/ng-bootstrap/util/util";

/*
User:
Home, Profile, Cart

Manager:
Manage, Profile

Staff:
Incoming Orders, Profile

Delivery User:
Delivery, Profile

Admin:
Administration, Profile
 */

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //LOGGED IN USERS
    if(this.authenticationService.getIsLoggedIn()) {
      //DISABLE LOG IN
      if (route.routeConfig?.path === 'login') {
        return false;
      }

      //ADMIN
      if (this.authenticationService.getRolesOfAccessToken().includes("ROLE_ADMIN")) {
        this.defaultRoute(route, 'admin');

        const paths: string[] = ['admin', 'profile'];
        return this.allow(route, paths);
      }

      //USER
      if (this.authenticationService.getRolesOfAccessToken().includes("ROLE_USER")) {
        this.defaultRoute(route, 'home');

        const paths: string[] = ['home', 'profile', 'cart'];
        return this.allow(route, paths);
      }

      //MANAGER
      if (this.authenticationService.getRolesOfAccessToken().includes("ROLE_MANAGER")) {
        this.defaultRoute(route, 'manager');

        const paths: string[] = ['manager', 'profile'];
        return this.allow(route, paths);
      }

      //STAFF
      if (this.authenticationService.getRolesOfAccessToken().includes("ROLE_STAFF")) {
        this.defaultRoute(route, 'staff');

        const paths: string[] = ['staff', 'profile'];
        return this.allow(route, paths);
      }

      //DELIVERY USER
      if (this.authenticationService.getRolesOfAccessToken().includes("ROLE_DELIVERY_USER")) {
        this.defaultRoute(route, 'delivery');

        const paths: string[] = ['delivery', 'profile'];
        return this.allow(route, paths);
      }

      //ALL LOGGED IN ACCOUNTS
      // ---
      //

      return false;
    }

    //Unlogged users
    else {
      this.defaultRoute(route, 'home');

      const paths: string[] = ['home', 'login', 'register'];
      return this.allow(route, paths);
    }
  }

  //Allowed access - home
  allow(route: ActivatedRouteSnapshot, paths: string[]): boolean {
    for(let path of paths) {
      if(route.routeConfig?.path === path) {
        return true;
      }
    }

    return false;
  }

  defaultRoute(route: ActivatedRouteSnapshot, path: string) {
    if (route.routeConfig?.path === '') {
      this.router.navigate(['/'+path]);
    }
  }
}
