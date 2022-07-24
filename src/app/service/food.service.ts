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

  deleteFood(food: any) {
    const url = 'http://localhost:8080/food/delete?id=' + food.id;
    return this.http.delete(url, {
      observe: 'response'
    });
  }

}
