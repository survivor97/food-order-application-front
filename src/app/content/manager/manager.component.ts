import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {FoodService} from "../../service/food.service";
import {RestaurantService} from "../../service/restaurant.service";
import {FoodMenu} from "../home/home.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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

  selectedFoodCategoryOption: string = '';
  selectedRestaurantOption: string = '';

  // region Manage food field
  foodList: any;
  nrOfFoodPages: number = 0;
  currentFoodPage: number = 0;
  foodPages: Array<number> = [];
  // endregion Manage food field

  // region Restaurant + Food category
  restaurantList: any;

  //Modal
  modalSelectedFoodCategoryOption: string = '';

  modalRestaurantList: any = [];
  modalAvailableRestaurantList: any = [];

  modalSelectedFood: any;

  foodId: number = 0;
  foodName: string = '';
  foodDescription: string = '';
  foodPrice: string = '';
  foodWeight: string = '';
  foodCategory: string = '';

  foodModalUpdate: boolean = false;
  // endregion Restaurant + Food category

  menuOption: ManagerMenu = ManagerMenu.RESTAURANTS;

  constructor(private authenticationService: AuthenticationService,
              private restaurantService: RestaurantService,
              private foodService: FoodService,
              private modalService: NgbModal) {
    this.restaurantService.getRestaurants().subscribe(data => {
      this.restaurantList = data;
      this.updateFoodPage();
    });
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  ngOnInit(): void {
  }

  updateModalSelectedFood(food: any): void {
    this.foodId = food.id;
    this.foodName = food.name;
    this.foodDescription = food.description;
    this.foodPrice = food.price;
    this.foodWeight = food.weight;
    this.foodCategory = food.foodCategory;

    this.modalSelectedFoodCategoryOption = food.foodCategory.name;
  }

  updateFoodPage(): void {
    console.warn('category: ' + this.selectedFoodCategoryOption);
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

  resetModalRestaurantList(): void {
    this.modalRestaurantList = [];
    this.modalAvailableRestaurantList = this.restaurantList;

    this.modalSelectedFoodCategoryOption = FoodMenu[0];
  }

  addRestaurantToModal(restaurant: any): void {
    this.modalRestaurantList.push(restaurant);

    this.modalAvailableRestaurantList = this.modalAvailableRestaurantList.filter(function(value: any){
      return value.id !== restaurant.id;
    });

    this.sortModalRestaurantLists();
  }

  removeRestaurantFromModal(restaurant: any): void {
    this.modalAvailableRestaurantList.push(restaurant);

    this.modalRestaurantList = this.modalRestaurantList.filter(function (value: any) {
      return value.id !== restaurant.id;
    })

    this.sortModalRestaurantLists();
  }

  sortModalRestaurantLists() {
    this.modalRestaurantList.sort(function(a: any, b: any) {
      return a.id - b.id;
    });
    this.modalAvailableRestaurantList.sort(function(a: any, b: any) {
      return a.id - b.id;
    });
  }

  updateModalFoodCategoryOption(input: any) {
    this.modalSelectedFoodCategoryOption = input.value;
  }

  updateModalRestaurantLists(food: any) {
    let currentRestaurantList = food.restaurantList;
    let modalRestaurantList = [];
    let modalAvailableRestaurantList = [];

    for(let restaurant of this.restaurantList) {
      if(currentRestaurantList.findIndex((i: { id: any; }) => i.id === restaurant.id) >= 0) {
        modalRestaurantList.push(restaurant);
      }
      else {
        modalAvailableRestaurantList.push(restaurant);
      }
    }

    this.modalRestaurantList = modalRestaurantList;
    this.modalAvailableRestaurantList = modalAvailableRestaurantList;
  }

  insertFood(): void {
    const food = {
      "name": this.foodName,
      "description": this.foodDescription,
      "price": this.foodPrice,
      "weight": this.foodWeight
    }
    this.foodService.insertFood(food, this.selectedFoodCategoryOption, this.modalRestaurantList).subscribe(data => {
      if(data.status === 201) {
        this.updateFoodPage();
      }
    });
  }

  updateFood(): void {
    const food = {
      "id": this.foodId,
      "name": this.foodName,
      "description": this.foodDescription,
      "price": this.foodPrice,
      "weight": this.foodWeight,
      "foodCategory": {
        "name": this.modalSelectedFoodCategoryOption
      },
      "restaurantList": this.modalRestaurantList
    }

    console.warn(food);

    this.foodService.updateFood(food).subscribe(data => {
      if(data.status === 200) {
        this.updateFoodPage();
      }
    });
  }

}
