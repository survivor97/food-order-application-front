import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService, OrderStatus} from "../../service/order.service";

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  pageLoaded: boolean = false;

  receivedOrderList: any;

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

  updateOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getOrderByStatus(OrderStatus.RECEIVED).subscribe(data => {
      this.receivedOrderList = data;
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

  rejectOrder(order: any): void {
    this.orderService.rejectOrder(order).subscribe(data => {
      if(data.status === 200) {
        this.updateOrderList();
      }
    });
  }

}
