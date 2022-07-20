import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  getRestaurants(): Observable<any> {
    const url = 'http://localhost:8080/restaurant/get-all';
    return this.http.get<any>(url);
  }

  insert(restaurant: any): Observable<any> {
    return this.http.post(
      'http://localhost:8080/restaurant/new',
      JSON.stringify(restaurant),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  updateRestaurant(restaurant: any): Observable<any> {
    return this.http.put(
      'http://localhost:8080/restaurant/update',
      JSON.stringify(restaurant),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  deleteRestaurant(id: number): Observable<any> {
    const url = 'http://localhost:8080/restaurant/delete?id=' + id;
    return this.http.delete(url, {
      observe: 'response'
    });
  }

}
