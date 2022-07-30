import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService, OrderStatus} from "../../service/order.service";

enum DeliveryMenu {
  NEW_ORDERS,
  ACTIVE_ORDER
}

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  menuOption: DeliveryMenu = DeliveryMenu.NEW_ORDERS;

  pageLoaded: boolean = false;

  acceptedOrderList: any = [];
  activeOrder: any;

  constructor(private authenticationService: AuthenticationService,
              private orderService: OrderService) {
      this.updateAvailableOrderList();
      this.getActiveOrder();
  }

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

  getDeliveryMenu(): typeof DeliveryMenu {
    return DeliveryMenu;
  }

  changeOption(option: DeliveryMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }

  updateAvailableOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getAccepterOrders().subscribe(data => {
      if(Array.isArray(data)) {
        this.acceptedOrderList = data.filter(order => order.deliveryUser == null);
        console.warn(this.acceptedOrderList);
      }
      this.pageLoaded = true;
    });
  }

  takeOrder(order: any) {
    this.orderService.takeOrder(order).subscribe(data => {
      if(data.status === 200) {
        console.warn("Order taken successfully!");
        this.updateAvailableOrderList();
        this.getActiveOrder();
      }
    });
  }

  setDelivered(order: any) {
    this.orderService.setOrderDelivered(order).subscribe(data => {
      if(data.status === 200) {
        console.warn("Order delivered successfully!");
        this.updateAvailableOrderList();
        this.activeOrder = null;
        this.changeOption(DeliveryMenu.NEW_ORDERS);
      }
    });
  }

  getActiveOrder() {
    this.orderService.getActiveOrder().subscribe(data => {
      this.activeOrder = data;
    })
  }

}
