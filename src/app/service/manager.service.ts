import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private http: HttpClient) { }

  getManagers(): Observable<any> {
    const url = 'http://localhost:8080/manager/get-all';
    return this.http.get<any>(url);
  }

  insertManager(manager: any): Observable<any> {
    return this.http.post(
      'http://localhost:8080/manager/new',
      JSON.stringify(manager),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  updateManager(manager: any): Observable<any> {
    return this.http.put(
      'http://localhost:8080/manager/update',
      JSON.stringify(manager),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  deleteManager(id: number): Observable<any> {
    const url = 'http://localhost:8080/manager/delete?id=' + id;
    return this.http.delete(url, {
      observe: 'response'
    });
  }

  getManagerInfo(): Observable<any> {
    const url = 'http://localhost:8080/manager/get-manager-info';
    return this.http.get<any>(url);
  }

}
