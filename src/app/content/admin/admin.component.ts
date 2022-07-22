import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {UserService} from "../../service/user.service";

enum AdminMenu {
  RESTAURANTS,
  MANAGERS,
  STAFF,
  DELIVERY_USERS,
  USERS
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  pageLoaded: boolean = false;

  currentUserPage: number = 0;
  userList: any;
  nrOfUserPages: number = 0;
  userPages: Array<number> = [];

  menuOption: AdminMenu = AdminMenu.RESTAURANTS;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) {
    this.updateUserPage();
  }

  ngOnInit(): void {
  }

  updateUserPage(): void {
    this.userService.getUserPage(this.currentUserPage).subscribe(data => {
      this.userList = data.content;
      this.nrOfUserPages = data.totalPages;
      this.userPages = [];
      for(let i=0; i<this.nrOfUserPages; i++) {
        this.userPages.push(i);
      }
      this.pageLoaded = true;
    });
  }

  increasePage(): void {
    if(this.currentUserPage < this.nrOfUserPages - 1) {
      this.currentUserPage++;
      this.updateUserPage();

      this.pageLoaded = false;
    }
    window.scrollTo(0, 0);
  }

  decreasePage(): void {
    if(this.currentUserPage > 0) {
      this.currentUserPage--;
      this.updateUserPage();

      this.pageLoaded = false;
    }
    window.scrollTo(0, 0);
  }

  setPage(page: number) {
    this.currentUserPage = page;
    this.updateUserPage();

    this.pageLoaded = false;

    window.scrollTo(0, 0);
  }

  isLoggedIn(): boolean {
    return this.authenticationService.getIsLoggedIn();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  getAdminMenu(): typeof AdminMenu {
    return AdminMenu;
  }

  getAvatarPath(): string {
    return Properties.avatar_path;
  }

  getUsername(): string {
    return this.authenticationService.getUsernameOfAccessToken();
  }

  changeOption(option: AdminMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }

}
