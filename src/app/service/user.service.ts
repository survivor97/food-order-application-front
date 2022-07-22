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

}
