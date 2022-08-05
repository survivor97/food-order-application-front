import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {UserService} from "../../service/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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

  @ViewChild('infoModal') infoModal: any;

  infoModalTitle: string = '';
  infoModalMessage: string = '';

  pageLoaded: boolean;

  currentUserPage: number = 0;
  userList: any;
  nrOfUserPages: number = 0;
  userPages: Array<number> = [];

  searchedUserList: any;
  searchUsername: string = '';
  searchEmail: string = '';

  menuOption: AdminMenu = AdminMenu.RESTAURANTS;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private modalService: NgbModal) {
    this.pageLoaded = false;
    this.updateUserPage();
  }

  ngOnInit(): void {
  }

  searchUserByUsernameOrEmail(): void {
    this.pageLoaded = false;

    this.userService.searchUserByUsernameOrEmail(this.searchUsername, this.searchEmail).subscribe(data => {
      this.searchedUserList = data;

      this.pageLoaded = true;
    });
  }

  deleteUser(user: any) {
    if(this.menuOption === AdminMenu.USERS) {
      this.pageLoaded = false;
    }

    this.userService.deleteUser(user).subscribe(data => {
      if(data.status === 200) {
        this.updateUserPage();
      }
    });
  }

  updateUserPage(): void {
    //Reset the searched user
    this.searchedUserList = null;

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
  }

  decreasePage(): void {
    if(this.currentUserPage > 0) {
      this.currentUserPage--;
      this.updateUserPage();

      this.pageLoaded = false;
    }
  }

  setPage(page: number) {
    this.currentUserPage = page;
    this.updateUserPage();

    this.pageLoaded = false;
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

  openInfoModal(title: string, message: string): void {
    this.infoModalTitle = title;
    this.infoModalMessage = message;
    this.modalService.open(this.infoModal, {centered: true, size: 'md'});
  }

  receiveEvent($event: any): void {
    this.openInfoModal($event.title, $event.message);
  }

}
