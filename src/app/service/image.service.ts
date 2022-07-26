import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  setImage(food: any, imageUUID: string): Observable<any> {
    const url = 'http://localhost:8080/food/set-image/' + food.id + '?uuid=' + imageUUID;
    return this.http.put(url,
      null,
      {
        observe: 'response'
      });
  }

  getImageUrl(imageUUID: string): string {
    const url = 'http://localhost:8080/image/get?name=' + imageUUID;
    return url;
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
