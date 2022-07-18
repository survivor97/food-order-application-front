import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  cartItems = new Map<number, any>();

  constructor() { }

  addToCart(food: any): void {
    if(food.quantity > 0) {
      //Initialize map value
      if(this.cartItems.get(food.id) == null) {
        food.cartQuantity = food.quantity;
        this.cartItems.set(food.id, food);
      }
      else {
        //Add
        this.cartItems.get(food.id).cartQuantity += food.quantity;
      }
      food.quantity = 0;
    }

    console.warn("CART: " + [...this.cartItems.entries()]);
  }

}
