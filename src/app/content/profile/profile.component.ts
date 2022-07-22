import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {UserService} from "../../service/user.service";
import {AdminService} from "../../service/admin.service";
import {ManagerService} from "../../service/manager.service";
import {StaffService} from "../../service/staff.service";
import {DeliveryUserService} from "../../service/delivery-user.service";

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

  favouriteFoodList: any;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private adminService: AdminService,
              private managerService: ManagerService,
              private staffService: StaffService,
              private deliveryUserService: DeliveryUserService) {
    if(this.hasRole("ROLE_USER")) {
      userService.getUserInfo().subscribe(data => {
        this.accountDetails = data;
        this.accountDetails.password = '';

      userService.getFavouriteFoodList().subscribe(data => {
        this.favouriteFoodList = data;
        this.pageLoaded = true;
      });
      });
    }
    else if(this.hasRole("ROLE_ADMIN")) {
      adminService.getAdminInfo().subscribe(data => {
        this.accountDetails = data;
        this.accountDetails.password = '';
        this.pageLoaded = true;
      });
    }
    else if(this.hasRole("ROLE_MANAGER")) {
      managerService.getManagerInfo().subscribe(data => {
        this.accountDetails = data;
        this.accountDetails.password = '';
        this.pageLoaded = true;
      });
    }
    else if(this.hasRole("ROLE_STAFF")) {
      staffService.getStaffInfo().subscribe(data => {
        this.accountDetails = data;
        this.accountDetails.password = '';
        this.pageLoaded = true;
      });
    }
    else if(this.hasRole("ROLE_DELIVERY_USER")) {
      deliveryUserService.getDeliveryUserInfo().subscribe(data => {
        this.accountDetails = data;
        this.accountDetails.password = '';
        this.pageLoaded = true;
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

  removeFoodFromFavourites(food: any): void {
    this.userService.removeFoodFromFavourites(food).subscribe(data => {
      if(data.status === 200) {
        this.favouriteFoodList.splice(this.favouriteFoodList.findIndex((i: { id: any; }) => i.id === food.id), 1);
      }
    });
  }

}
