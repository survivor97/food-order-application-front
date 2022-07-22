import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";

enum ManagerMenu {
  RESTAURANTS,
  FOOD,
  STAFF,
  DELIVERY_USERS
}

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  menuOption: ManagerMenu = ManagerMenu.RESTAURANTS;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.authenticationService.getIsLoggedIn();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  getAvatarPath(): string {
    return Properties.avatar_path;
  }

  getUsername(): string {
    return this.authenticationService.getUsernameOfAccessToken();
  }

  getManagerMenu(): typeof ManagerMenu {
    return ManagerMenu;
  }

  changeOption(option: ManagerMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }
}
