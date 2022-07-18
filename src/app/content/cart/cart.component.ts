import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService} from "../../service/order.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems = new Map<number, any>();

  constructor(private authenticationService: AuthenticationService,
              private orderService: OrderService) {
    this.cartItems = this.orderService.cartItems;
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

  removeItem(cartItem: any) {
    this.cartItems.delete(cartItem.id);
  }

}
