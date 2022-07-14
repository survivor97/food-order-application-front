import { Component, OnInit } from '@angular/core';
import {RestaurantService} from "../../service/restaurant.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private restaurantService: RestaurantService) {
    this.restaurantService.getRestaurants().subscribe(data => {
      console.warn(data.constructor);
    });
  }

  ngOnInit(): void {
  }
  
}
