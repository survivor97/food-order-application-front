import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService, OrderStatus} from "../../service/order.service";

enum StaffMenu {
  PENDING,
  ACCEPTED,
  PREPARING
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  menuOption: StaffMenu = StaffMenu.PENDING;

  pageLoaded: boolean = false;

  receivedOrderList: any = [];
  acceptedOrderList: any = [];
  preparingOrderList: any = [];

  constructor(private authenticationService: AuthenticationService,
              private orderService: OrderService) {
    this.updateOrderList();
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

  getStaffMenu(): typeof StaffMenu {
    return StaffMenu;
  }

  changeOption(option: StaffMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }

  updateOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getOrderByStatus(OrderStatus.RECEIVED).subscribe(data => {
      this.receivedOrderList = data;
      this.pageLoaded = true;
    });
  }

  updateAcceptedOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getOrderByStatus(OrderStatus.ACCEPTED).subscribe(data => {
      this.acceptedOrderList = data;
      this.pageLoaded = true;
    });
  }

  updatePreparingOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getOrderByStatus(OrderStatus.PREPARING).subscribe(data => {
      this.preparingOrderList = data;
      this.pageLoaded = true;
    });
  }

  acceptOrder(order: any): void {
    this.orderService.acceptOrder(order).subscribe(data => {
      if(data.status === 200) {
        this.updateOrderList();
      }
    });
  }

  prepareOrder(order: any): void {
    this.orderService.prepareOrder(order).subscribe(data => {
      if(data.status === 200) {
        this.updateAcceptedOrderList();
      }
    });
  }

  shipOrder(order: any): void {
    this.orderService.shipOrder(order).subscribe(data => {
      if(data.status === 200) {
        this.updatePreparingOrderList();
      }
    });
  }

  rejectOrder(order: any): void {
    this.orderService.rejectOrder(order).subscribe(data => {
      if(data.status === 200) {
        if(this.menuOption === StaffMenu.PENDING) {
          this.updateOrderList();
        }
        else if(this.menuOption === StaffMenu.ACCEPTED) {
          this.updateAcceptedOrderList();
        }
        else if(this.menuOption === StaffMenu.PREPARING) {
          this.updatePreparingOrderList();
        }
      }
    });
  }

}
