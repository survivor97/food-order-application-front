import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  searchFood(page:number, category: string, restaurantName: string): Observable<any> {
    const url = 'http://localhost:8080/food/search?category=' + category + '&restaurantName=' + restaurantName + '&page=' + page;
    return this.http.get<any>(url);
  }

  getFoodList(page: number): Observable<any> {
    const url = 'http://localhost:8080/food?page=' + page;
    return this.http.get<any>(url);
  }

  getFoodListOfCategory(category: string, page: number) {
    const url = 'http://localhost:8080/food/' + category + '?page=' + page;
    return this.http.get<any>(url);
  }

  getFoodListOfCategoryAndRestaurantId(category: string, restaurantId: number, page: number) {
    const url = 'http://localhost:8080/food/' + category + '/' + restaurantId + '?page=' + page;
    return this.http.get<any>(url);
  }

  insertFood(food: any, category: string, restaurantList: any): Observable<any> {
    let url = 'http://localhost:8080/food/insert?category=' + category + '&restaurantId=';
    for(let restaurant of restaurantList) {
      url = url.concat(restaurant.id + ',');
    };

    url = url.slice(0, url.length - 1);

    console.warn(url);

    return this.http.post(
      url,
      JSON.stringify(food),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  deleteFood(food: any) {
    const url = 'http://localhost:8080/food/delete?id=' + food.id;
    return this.http.delete(url, {
      observe: 'response'
    });
  }

}
