import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  getFoodList(page: number): Observable<any> {
    const url = 'http://localhost:8080/food?page=' + page;
    return this.http.get<any>(url);
  }

}
