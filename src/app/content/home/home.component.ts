import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {FoodService} from "../../service/food.service";
import {Router} from "@angular/router";
import {OrderService} from "../../service/order.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RestaurantService} from "../../service/restaurant.service";
import {UserService} from "../../service/user.service";
import {ImageService} from "../../service/image.service";

export enum FoodMenu {
  PIZZA,
  BURGER,
  GRILL,
  FAST_FOOD,
  DESSERT,
  DRINK
}

export namespace FoodMenu {
  export function keys(): Array<string>{
    var keys = Object.keys(FoodMenu);
    return keys.slice(keys.length / 2, keys.length-1);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('favouritesModal') favouritesModal: any;

  pageLoaded: boolean = false;
  justAddedToFavourites: boolean = false;

  foodList: any;
  nrOfFoodPages: number = 0;
  currentFoodPage: number = 0;
  foodPages: Array<number> = [];
  lastAddedFood: any;
  lastAddedToCartQuantity: number = 0;

  menuOption: FoodMenu = FoodMenu.PIZZA;

  selectedRestaurant: any;
  restaurantList: any;

  favouriteFoodList: any;

  constructor(private foodService: FoodService,
              private authenticationService: AuthenticationService,
              private restaurantService: RestaurantService,
              private orderService: OrderService,
              private userService: UserService,
              private imageService: ImageService,
              private router: Router,
              private modalService: NgbModal) {
    this.restaurantList = restaurantService.getRestaurants().subscribe(data => {
      this.restaurantList = data;
      this.selectedRestaurant = this.restaurantList[0];
      this.updateFoodPage();
    });

    this.favouriteFoodList = userService.getFavouriteFoodList().subscribe(data => {
      this.favouriteFoodList = data;
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
    this.foodService.getFoodListOfCategoryAndRestaurantId(FoodMenu[this.menuOption], this.selectedRestaurant.id, this.currentFoodPage).subscribe(data => {
      this.foodList = data.content;
      this.nrOfFoodPages = data.totalPages;
      this.foodPages = [];
      for(let i=0; i<this.nrOfFoodPages; i++) {
        this.foodPages.push(i);
      }
      this.resetFoodQuantity();
      this.pageLoaded = true;
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

  deleteFood(food: any) {
    this
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

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  addToCart(food: any) {
    this.orderService.addToCart(food);
  }

  openAddedToCartModal(content: any, food:any, quantity: number): void {
    this.lastAddedFood = food;
    this.lastAddedToCartQuantity = quantity;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title-email', centered: true, size: 'md'});
  }

  openFavouritesModal(content: any, justAddedToFavourites: boolean) {
    this.justAddedToFavourites = justAddedToFavourites;
    const activeModal = this.modalService.open(content, {centered: true, size: 'md'});
  }

  selectRestaurant(restaurant: any) {
    this.pageLoaded = false;

    this.selectedRestaurant = restaurant;
    this.updateFoodPage();
  }

  addFoodToFavourites(food: any): void {
    this.userService.addFoodToFavourites(food).subscribe(data => {
      if(data.status === 200) {
        this.favouriteFoodList.push(food);
        this.openFavouritesModal(this.favouritesModal, true);
      }
    });
  }

  removeFoodFromFavourites(food: any): void {
    this.userService.removeFoodFromFavourites(food).subscribe(data => {
      if(data.status === 200) {
        this.favouriteFoodList.splice(this.favouriteFoodList.findIndex((i: { id: any; }) => i.id === food.id), 1);
        this.openFavouritesModal(this.favouritesModal, false);
      }
    });
  }

  hasFoodToFavourites(food: any): boolean {
    for(let i=0; i<this.favouriteFoodList.length; i++) {
      if(this.favouriteFoodList[i].id === food.id) {
        return true;
      }
    }
    return false;
  }

  getImageUrl(food: any): string {
    return this.imageService.getImageUrl(food.foodImage.resourceName);
  }

}
