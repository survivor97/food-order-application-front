import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FoodMenu} from "../content/home/home.component";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  searchFood(page:number, category: string, restaurantName: string): Observable<any> {
    const url = 'http://localhost:8080/food/search?category=' + category + '&restaurantName=' + restaurantName + '&page=' + page;
    console.warn('search food url: ' + url);
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

  insertFood(food: any): Observable<any> {
    let url = 'http://localhost:8080/food/insert';

    console.warn(food);

    return this.http.post(
      url,
      JSON.stringify(food),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  updateFood(food: any): Observable<any> {
    return this.http.put(
      'http://localhost:8080/food/update',
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

  mapRecognizedFoodCategory(name: any): string {
    if(name === 'Shawarma') {
      return FoodMenu[FoodMenu.FAST_FOOD];
    }
    else if(name === 'Pepperoni') {
      return FoodMenu[FoodMenu.PIZZA];
    }
    else if(name === 'Meatball') {
      return FoodMenu[FoodMenu.FAST_FOOD];
    }
    else if(name === 'Cheeseburger') {
      return FoodMenu[FoodMenu.FAST_FOOD];
    }
    else if(name === 'Ice cream cake') {
      return FoodMenu[FoodMenu.DESSERT];
    }
    else if(name === 'Icebox cake') {
      return FoodMenu[FoodMenu.DESSERT];
    }
    else if(name === 'Sundae') {
      return FoodMenu[FoodMenu.DESSERT];
    }
    else if(name === 'Carne asada') {
      return FoodMenu[FoodMenu.GRILL];
    }
    return 'unknown';
  }

}
