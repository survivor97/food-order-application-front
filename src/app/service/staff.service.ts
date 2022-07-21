import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) { }

  getAllStaff(): Observable<any> {
    const url = 'http://localhost:8080/staff/get-all';
    return this.http.get<any>(url);
  }

  insertStaff(staff: any): Observable<any> {
    return this.http.post(
      'http://localhost:8080/staff/new',
      JSON.stringify(staff),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  updateStaff(staff: any): Observable<any> {
    return this.http.put(
      'http://localhost:8080/staff/update',
      JSON.stringify(staff),
      {
        headers: {'Content-Type':'application/json; charset=utf-8'},
        observe: 'response'
      });
  }

  deleteStaff(id: number): Observable<any> {
    const url = 'http://localhost:8080/staff/delete?id=' + id;
    return this.http.delete(url, {
      observe: 'response'
    });
  }

}
