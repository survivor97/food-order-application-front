import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export enum OrderStatus {
  RECEIVED,
  ACCEPTED,
  PREPARING,
  ON_THE_WAY,
  DELIVERED,
  REJECTED
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  cartItems = new Map<number, any>();

  constructor(private http: HttpClient) { }

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
    // console.warn("CART: " + [...this.cartItems.entries()])
  }

  placeOrder(order: any): Observable<any> {
    console.warn(JSON.stringify(order));
    const url = 'http://localhost:8080/orders/new-authenticated';
    return this.http.post(url,
      JSON.stringify(order),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  acceptOrder(order: any): Observable<any> {
    const url = 'http://localhost:8080/orders/accept-order?id=' + order.id;
    return this.http.put(url,
      null,
      {
        observe: 'response'
      });
  }

  getOrderByStatus(orderStatus: OrderStatus) {
    const url = 'http://localhost:8080/orders?status=' + OrderStatus[orderStatus.valueOf()];
    return this.http.get(url);
  }

  rejectOrder(order: any) {
    const url = 'http://localhost:8080/orders/set-rejected-status?id=' + order.id;
    return this.http.put(url,
      null,
      {
        observe: 'response'
      });
  }

  resetCartItems(): void {
    this.cartItems = new Map<number, any>();
  }

}
