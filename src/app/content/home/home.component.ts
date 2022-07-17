import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {FoodService} from "../../service/food.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  foodList: any;
  nrOfFoodPages: number = 0;
  currentFoodPage: number = 0;
  foodPages: Array<number> = [];

  constructor(private foodService: FoodService,
              private authenticationService: AuthenticationService) {
    this.foodService.getFoodList(0).subscribe(data => {
      this.foodList = data.content;
      this.nrOfFoodPages = data.totalPages;
      for(let i=0; i<this.nrOfFoodPages; i++) {
        this.foodPages.push(i);
      }
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

  increasePage(): void {
    if(this.currentFoodPage < this.nrOfFoodPages - 1) {
      this.currentFoodPage++;
      this.updateFoodPage();
    }
  }

  decreasePage(): void {
    if(this.currentFoodPage > 0) {
      this.currentFoodPage--;
      this.updateFoodPage();
    }
  }

  updateFoodPage(): void {
    this.foodService.getFoodList(this.currentFoodPage).subscribe(data => {
      this.foodList = data.content;
    });
  }

}
