import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService} from "../../service/order.service";
import {Router} from "@angular/router";

enum CartMenu {
  LIST,
  ADDRESS,
  SUMMARY
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems = new Map<number, any>();
  foodList: any = [];

  menuOption: CartMenu = CartMenu.LIST;

  streetAddress: string = '';
  city: string = '';
  zipCode: string = '';

  constructor(private authenticationService: AuthenticationService,
              private orderService: OrderService,
              private router: Router) {
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

  getCartTotal(): number {
    let total = 0;

    this.cartItems.forEach((value: any, key: number) => {
      total += value.cartQuantity * value.price;
    });

    return total;
  }

  isShippingAddressComplete(): boolean {
    if(
      this.streetAddress.length > 0 &&
      this.city.length > 0 &&
      this.zipCode.length > 0
    ) {
      return  true;
    }
    return false;
  }

  placeOrder(): void {
    for(let cartItem of this.cartItems.values()) {
      for(let i=0; i<cartItem.cartQuantity; i++) {
        const foodItem = {
          "id": cartItem.id
        }
        this.foodList.push(foodItem);
      }
    }

    const order = {
      "foodList": this.foodList,
      "address": {
        "streetAddress": this.streetAddress,
        "city": this.city,
        "zipCode": this.zipCode
      }
    }

    this.orderService.placeOrder(order).subscribe(data => {
      if(data.status === 201) {
        console.warn("Order sent successfully");
        this.orderService.resetCartItems();
        this.foodList = [];
        this.router.navigate(['']);
      }
    });
  }

}
