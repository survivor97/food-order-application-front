import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {Properties} from "../../../properties";

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.css']
})
export class AccountDropdownComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
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

  logout(): void {
    this.authenticationService.logout();
  }

}
