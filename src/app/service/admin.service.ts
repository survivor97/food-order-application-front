import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAdminInfo(): Observable<any> {
    const url = 'http://localhost:8080/admin/get-admin-info';
    return this.http.get<any>(url);
  }

}
