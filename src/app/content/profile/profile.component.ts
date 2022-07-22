import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {UserService} from "../../service/user.service";

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

  pageLoaded: boolean = false;
  menuOption: ProfileMenu = ProfileMenu.INFO;

  accountDetails: any;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) {
    if(this.hasRole("ROLE_USER")) {
      userService.getUserInfo().subscribe(data => {
        this.accountDetails = data;
        this.accountDetails.password = '';
        this.pageLoaded = true;

        console.warn("page loaded: " + this.pageLoaded);
      });
    }
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

  hasUserRole(): boolean {
    return this.authenticationService.getRolesOfAccessToken().includes("ROLE_USER");
  }

  hasRole(role: string) {
    return this.authenticationService.getRolesOfAccessToken().includes(role);
  }
}
