import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService} from "../../service/order.service";

enum CartMenu {
  SUMMARY,
  ADDRESS
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems = new Map<number, any>();

  menuOption: CartMenu = CartMenu.SUMMARY;

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

  increaseCartQuantity(cartItem: any) {
    this.cartItems.get(cartItem.id).cartQuantity++;
  }

  decreaseCartQuantity(cartItem: any) {
    if(this.cartItems.get(cartItem.id).cartQuantity > 1) {
      this.cartItems.get(cartItem.id).cartQuantity--;
    }
  }

  changeOption(option: CartMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }

  getCartMenu(): typeof CartMenu {
    return CartMenu;
  }

}
