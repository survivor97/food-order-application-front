import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserInfo(): Observable<any> {
    const url = 'http://localhost:8080/user/get-user-info';
    return this.http.get<any>(url);
  }

  getFavouriteFoodList(): Observable<any> {
    const url = 'http://localhost:8080/user/get-favorite-food';
    return this.http.get<any>(url);
  }

  addFoodToFavourites(food: any): Observable<any> {
    const url = 'http://localhost:8080/user/add-food-to-favorites?foodId=' + food.id;
    return this.http.put(url, null, { observe: 'response' });
  }

  removeFoodFromFavourites(food: any): Observable<any> {
    const url = 'http://localhost:8080/user/remove-food-from-favourites?id=' + food.id;
    return this.http.delete(url, {
      observe: 'response'
    });
  }

}
