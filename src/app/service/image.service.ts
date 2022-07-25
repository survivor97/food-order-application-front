import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getImage(imageName: string): Observable<any> {
    const url = 'http://localhost:8080/get/image/' + imageName;
    return this.http.get(url,
      {
        responseType: 'blob'
      });
  }

  postImage(uploadedImage: any): Observable<any> {
    const imageFormData = new FormData();
    imageFormData.append('image', uploadedImage, uploadedImage.name);

    return this.http.post('http://localhost:8080/upload/image',
      imageFormData,
      { observe: 'response' }
    );
  }
}
