import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DeliveryUserService {

  constructor(private http: HttpClient) { }

  getAllDeliveryUsers(): Observable<any> {
    const url = 'http://localhost:8080/delivery-user/get-all';
    return this.http.get<any>(url);
  }

  insertDeliveryUser(deliveryUser: any): Observable<any> {
    return this.http.post(
      'http://localhost:8080/delivery-user/new',
      JSON.stringify(deliveryUser),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  updateDeliveryUser(deliveryUser: any): Observable<any> {
    return this.http.put(
      'http://localhost:8080/delivery-user/update',
      JSON.stringify(deliveryUser),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  updateAuthenticatedDeliveryUser(deliveryUser: any): Observable<any> {
    return this.http.put(
        'http://localhost:8080/delivery-user/update-authenticated',
        JSON.stringify(deliveryUser),
        {
          headers: {'Content-Type':'application/json; charset=utf-8'},
          observe: 'response'
        });
  }

  deleteDeliveryUser(id: number): Observable<any> {
    const url = 'http://localhost:8080/delivery-user/delete?id=' + id;
    return this.http.delete(url, {
      observe: 'response'
    });
  }

  getDeliveryUserInfo(): Observable<any> {
    const url = 'http://localhost:8080/delivery-user/get-delivery-user-info';
    return this.http.get<any>(url);
  }

  getOrderHistory(): Observable<any> {
    const url = 'http://localhost:8080/delivery-user/get-order-history';
    return this.http.get<any>(url);
  }
}
