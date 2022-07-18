import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {FoodService} from "../../service/food.service";
import {Router} from "@angular/router";
import {OrderService} from "../../service/order.service";

enum FoodMenu {
  PIZZA,
  BURGER,
  GRILL,
  FAST_FOOD,
  DESSERT,
  DRINK
}

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

  menuOption: FoodMenu = FoodMenu.PIZZA;

  constructor(private foodService: FoodService,
              private authenticationService: AuthenticationService,
              private orderService: OrderService,
              private router: Router) {
    this.updateFoodPage();
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
    window.scrollTo(0, 0);
  }

  decreasePage(): void {
    if(this.currentFoodPage > 0) {
      this.currentFoodPage--;
      this.updateFoodPage();
    }
    window.scrollTo(0, 0);
  }

  updateFoodPage(): void {
    this.foodService.getFoodListOfCategory(FoodMenu[this.menuOption], this.currentFoodPage).subscribe(data => {
      this.foodList = data.content;
      this.nrOfFoodPages = data.totalPages;
      this.foodPages = [];
      for(let i=0; i<this.nrOfFoodPages; i++) {
        this.foodPages.push(i);
      }
      this.resetFoodQuantity();
    });
  }

  setPage(page: number) {
    this.currentFoodPage = page;
    this.updateFoodPage();
    window.scrollTo(0, 0);
  }

  getFoodMenu(): typeof FoodMenu {
    return FoodMenu;
  }

  changeOption(option: FoodMenu): void {
    this.menuOption = option;
    this.currentFoodPage = 0;
    this.updateFoodPage();
    window.scrollTo(0, 0);
  }

  getUsername(): string {
    return this.authenticationService.getUsernameOfAccessToken();
  }

  increaseQuantity(food: any) {
    food.quantity += 1;
  }

  decreaseQuantity(food: any) {
    if(food.quantity > 0) {
      food.quantity -= 1;
    }
  }

  resetFoodQuantity(): void {
    for(let i=0; i<this.foodList.length; i++) {
      this.foodList[i].quantity = 0;
    }
  }

  addButton(food: any): void {
    if(!this.authenticationService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }
    else {
      this.addToCart(food);
    }
  }

  addToCart(food: any) {
    this.orderService.addToCart(food);
  }

}
