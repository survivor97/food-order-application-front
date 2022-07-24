import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {FoodService} from "../../service/food.service";
import {RestaurantService} from "../../service/restaurant.service";
import {FoodMenu} from "../home/home.component";

enum ManagerMenu {
  RESTAURANTS,
  FOOD,
  STAFF,
  DELIVERY_USERS
}

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  pageLoaded: boolean = false;

  // region Manage food field
  foodList: any;
  nrOfFoodPages: number = 0;
  currentFoodPage: number = 0;
  foodPages: Array<number> = [];
  // endregion Manage food field

  // region Restaurant + Food category
  restaurantList: any;

  selectedRestaurantOption: string = '';
  selectedFoodCategoryOption: string = '';
  // endregion Restaurant

  menuOption: ManagerMenu = ManagerMenu.RESTAURANTS;

  constructor(private authenticationService: AuthenticationService,
              private restaurantService: RestaurantService,
              private foodService: FoodService) {
    this.restaurantService.getRestaurants().subscribe(data => {
      this.restaurantList = data;
      this.updateFoodPage();
    });
  }

  logRestaurantOption(): void {
    console.warn("Restaurant option: " + this.selectedRestaurantOption);
  }

  logFoodCategoryOption(): void {
    console.warn("Food Category option: " + this.selectedFoodCategoryOption);
  }

  ngOnInit(): void {
  }

  updateFoodPage(): void {
    this.pageLoaded = false;

    this.foodService.searchFood(this.currentFoodPage, this.selectedFoodCategoryOption, this.selectedRestaurantOption).subscribe(data => {
      this.foodList = data.content;
      this.nrOfFoodPages = data.totalPages;
      this.foodPages = [];
      for(let i=0; i<this.nrOfFoodPages; i++) {
        this.foodPages.push(i);
      }

      this.pageLoaded = true;
    });
  }

  increasePage(): void {
    if(this.currentFoodPage < this.nrOfFoodPages - 1) {
      this.currentFoodPage++;
      this.updateFoodPage();

      this.pageLoaded = false;
    }
  }

  decreasePage(): void {
    if(this.currentFoodPage > 0) {
      this.currentFoodPage--;
      this.updateFoodPage();

      this.pageLoaded = false;
    }
  }

  setPage(page: number) {
    this.currentFoodPage = page;
    this.updateFoodPage();

    this.pageLoaded = false;
  }

  deleteFood(food: any) {
    this.foodService.deleteFood(food).subscribe(data => {
      if(data.status === 200) {
        this.updateFoodPage();
      }
    });
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

  getUsername(): string {
    return this.authenticationService.getUsernameOfAccessToken();
  }

  getManagerMenu(): typeof ManagerMenu {
    return ManagerMenu;
  }

  changeOption(option: ManagerMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }

  getFoodMenu(): typeof FoodMenu {
    return FoodMenu;
  }
}
