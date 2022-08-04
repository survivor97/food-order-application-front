import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {UserService} from "../../service/user.service";
import {AdminService} from "../../service/admin.service";
import {ManagerService} from "../../service/manager.service";
import {StaffService} from "../../service/staff.service";
import {DeliveryUserService} from "../../service/delivery-user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {OrderStatus} from "../../service/order.service";
import {StompService} from "../../service/websocket/stomp.service";

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

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private adminService: AdminService,
              private managerService: ManagerService,
              private staffService: StaffService,
              private deliveryUserService: DeliveryUserService,
              private modalService: NgbModal,
              private stompService: StompService) {
    if(this.hasRole("ROLE_USER")) {
      userService.getUserInfo().subscribe(data => {
        this.accountDetails = data;
        this.accountDetails.password = '';

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

}
