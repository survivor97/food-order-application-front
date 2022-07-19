import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";

enum ProfileMenu {
  INFO,
  FAVOURITE_FOOD
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  menuOption: ProfileMenu = ProfileMenu.INFO;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authenticationService.logout();
  }

  isLoggedIn(): boolean {
    return this.authenticationService.getIsLoggedIn();
  }

  getAvatarPath(): string {
    return Properties.avatar_path;
  }

  getUsername(): string {
    return this.authenticationService.getUsernameOfAccessToken();
  }

  getProfileMenu(): typeof ProfileMenu {
    return ProfileMenu;
  }

  changeOption(option: ProfileMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }
}
