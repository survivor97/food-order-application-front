import { Component, OnInit } from '@angular/core';
import {RestaurantService} from "../../service/restaurant.service";
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private restaurantService: RestaurantService,
              private authenticationService: AuthenticationService) {
    this.restaurantService.getRestaurants().subscribe(data => {
      console.warn(data.constructor);
    });
  }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.authenticationService.getIsLoggedIn();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  getAvatarPath(): string {
    return Properties.avatar_path;
  }

}
