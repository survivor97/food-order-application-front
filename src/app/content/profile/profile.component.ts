import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {UserService} from "../../service/user.service";
import {AdminService} from "../../service/admin.service";
import {ManagerService} from "../../service/manager.service";
import {StaffService} from "../../service/staff.service";
import {DeliveryUserService} from "../../service/delivery-user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StompService} from "../../service/websocket/stomp.service";
import {LoginService} from "../../service/login.service";

enum ProfileMenu {
  INFO,
  FAVOURITE_FOOD,
  ORDER_HISTORY
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('infoModal') infoModal: any;

  infoModalTitle: string = '';
  infoModalMessage: string = '';

  pageLoaded: boolean = false;
  menuOption: ProfileMenu = ProfileMenu.INFO;

  accountDetails: any;

  // region User Field
  favouriteFoodList: any;
  orderHistoryList: any;
  // endregion User Field

  // region selected modal food
  selectedOrderModal: any;
  mappedOrder: any = new Map<number, any>();
  filteredOrderFood: any = [];
  // endregion selected modal food

  // user identity
  userType: string = '';
  //

  // submitted field
  wrongPassword: boolean = false;
  newPasswordsDontMatch: boolean = false;
  //

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private adminService: AdminService,
              private managerService: ManagerService,
              private staffService: StaffService,
              private deliveryUserService: DeliveryUserService,
              private modalService: NgbModal,
              private stompService: StompService,
              private loginService: LoginService) {
    if(this.hasRole("ROLE_USER")) {
      this.userType = 'USER';

      userService.getUserInfo().subscribe(data => {
        this.accountDetails = data;
        this.resetPasswords();

        userService.getFavouriteFoodList().subscribe(data => {
          this.favouriteFoodList = data;
          this.pageLoaded = true;
        });

        this.updateUserOrderHistory();
      });

      //Customer websocket

      let topics: string[] = new Array('/topic/customer/' + authenticationService.getUsernameOfAccessToken());

      this.stompService.subscribe(topics,(message: string): void => {
        this.customerSubscribeCallback(message);
      },(): void => {
      });

    }
    else if(this.hasRole("ROLE_ADMIN")) {
      this.userType = 'ADMIN';

      adminService.getAdminInfo().subscribe(data => {
        this.accountDetails = data;
        this.resetPasswords();
        this.pageLoaded = true;
      });
    }
    else if(this.hasRole("ROLE_MANAGER")) {
      this.userType = 'MANAGER';

      managerService.getManagerInfo().subscribe(data => {
        this.accountDetails = data;
        this.resetPasswords();
        this.pageLoaded = true;
      });
    }
    else if(this.hasRole("ROLE_STAFF")) {
      this.userType = 'STAFF';

      staffService.getStaffInfo().subscribe(data => {
        this.accountDetails = data;
        this.resetPasswords();
        this.pageLoaded = true;
      });
    }
    else if(this.hasRole("ROLE_DELIVERY_USER")) {
      this.userType = 'DELIVERY_USER';

      deliveryUserService.getDeliveryUserInfo().subscribe(data => {
        this.accountDetails = data;
        this.resetPasswords();
        this.pageLoaded = true;
      });
    }
  }

  ngOnInit(): void {
  }

  customerSubscribeCallback(message: string): void {
    const responseMessage = JSON.parse(message);
    if(responseMessage.messageContent === 'order-update') {
      this.pageLoaded = false;
      this.updateUserOrderHistory();
    }
  }

  updateUserOrderHistory() {
    this.userService.getOrderHistory().subscribe(data => {
      this.orderHistoryList = data;
      this.pageLoaded = true;
    });
  }

  logout(): void {
    this.authenticationService.logout();
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

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  selectModalOrder(order: any) {
    this.selectedOrderModal = order;
    this.mapOrder(order);
  }

  mapOrder(order: any): void {

    this.mappedOrder = new Map<number, any>();

    order.foodList.forEach((data: any) => {
      if(this.mappedOrder.get(data.id) == null) {
        data.quantity = 1;
        this.mappedOrder.set(data.id, data);
      }
      else {
        this.mappedOrder.get(data.id).quantity++;
      }
    });

    let seenItems: any = {};

    this.filteredOrderFood = order.foodList.filter((data: any) => {
      return seenItems.hasOwnProperty(data.id) ? false : (seenItems[data.id] = true);
    });
  }

  getMappedQuantity(food: any): number {
    return this.mappedOrder.get(food.id).quantity;
  }

  getCartTotal(): number {
    let total = 0;

    this.selectedOrderModal.foodList.forEach((food: any) => {
      total += parseInt(food.price);
    });

    return total;
  }

  getCartTotalForOrder(order: any): number {
    let total = 0;

    order.foodList.forEach((food: any) => {
      total += parseInt(food.price);
    });

    return total;
  }

  openInfoModal(title: string, message: string): void {
    this.infoModalTitle = title;
    this.infoModalMessage = message;
    this.modalService.open(this.infoModal, {centered: true, size: 'md'});
  }

  resetPasswords(): void {
    this.accountDetails.password = '';
    this.accountDetails.currentPassword = '';
    this.accountDetails.newPassword = '';
    this.accountDetails.newPasswordConfirm = '';
  }

  saveCall(): void {
    if(this.userType === 'USER') {
      this.userService.updateUser(this.accountDetails).subscribe(data => {
        if(data.status === 200) {
          this.openInfoModal('Account updated!', 'Account updated successfully!');
          this.resetPasswords();
        }
      });
    }
    else if(this.userType === 'ADMIN') {
      this.adminService.updateAdmin(this.accountDetails).subscribe(data => {
        if(data.status === 200) {
          this.openInfoModal('Account updated!', 'Account updated successfully!');
          this.resetPasswords();
        }
      });
    }
    else if(this.userType === 'MANAGER') {
      this.managerService.updateAuthenticatedManager(this.accountDetails).subscribe(data => {
        if(data.status === 200) {
          this.openInfoModal('Account updated!', 'Account updated successfully!');
          this.resetPasswords();
        }
      });
    }
    else if(this.userType === 'STAFF') {
      this.staffService.updateAuthenticatedStaff(this.accountDetails).subscribe(data => {
        if(data.status === 200) {
          this.openInfoModal('Account updated!', 'Account updated successfully!');
          this.resetPasswords();
        }
      });
    }
    else if(this.userType === 'DELIVERY_USER') {
      this.deliveryUserService.updateAuthenticatedDeliveryUser(this.accountDetails).subscribe(data => {
        if(data.status === 200) {
          this.openInfoModal('Account updated!', 'Account updated successfully!');
          this.resetPasswords();
        }
      });
    }
  }

  saveProfile(): void {
    this.loginService.login(this.accountDetails.username, this.accountDetails.currentPassword).subscribe(data => {
      if(data.status === 200) {

        // CHANGE PASSWORD
        if(this.accountDetails.newPassword.length > 0 || this.accountDetails.newPasswordConfirm.length > 0) {
          if(this.accountDetails.newPassword === this.accountDetails.newPasswordConfirm) {
            this.wrongPassword = false;
            this.newPasswordsDontMatch = false;

            this.accountDetails.password = this.accountDetails.newPassword;
            this.saveCall();
          }
          else {
            this.newPasswordsDontMatch = true;
            this.openInfoModal('Save Failed', 'New password doesn\'t match');
          }
        }

        // WITHOUT NEW PASSWORD
        else {
          this.accountDetails.password = null;

          this.saveCall();
          this.resetPasswords();

          this.wrongPassword = false;
          this.newPasswordsDontMatch = false;
        }
      }
    }, error => {
      this.openInfoModal('Save Failed', 'Wrong account password');
      this.wrongPassword = true;
      console.warn("NOT OK");
    });
  }

}
