import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {FoodService} from "../../service/food.service";
import {RestaurantService} from "../../service/restaurant.service";
import {FoodMenu} from "../home/home.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImageService} from "../../service/image.service";
import {DomSanitizer} from "@angular/platform-browser";

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

  @ViewChild('infoModal') infoModal: any;

  infoModalTitle: string = '';
  infoModalMessage: string = '';

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
  modalSelectedFoodCategoryOption = FoodMenu[0];

  modalRestaurantList: any = [];
  modalAvailableRestaurantList: any = [];

  modalSelectedFood: any;

  foodId: number = 0;
  foodName: string = '';
  foodDescription: string = '';
  foodPrice: string = '';
  foodWeight: string = '';
  foodImage: any;
  foodCategory: string = '';

  foodModalUpdate: boolean = false;
  // endregion Restaurant + Food category

  // region Image upload
  uploadedImage: any;

  uploadStatus: string = '';
  uploadedImageResponseObject: any;
  foodPrediction: string = '';
  // endregion

  menuOption: ManagerMenu = ManagerMenu.RESTAURANTS;

  constructor(private authenticationService: AuthenticationService,
              private restaurantService: RestaurantService,
              private foodService: FoodService,
              private imageService: ImageService,
              private sanitizer: DomSanitizer,
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
    this.foodImage = food.foodImage;
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
        this.openInfoModal('Food Removed', 'Food removed successfully!');
        this.updateFoodPage();
      }
    });
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
      "weight": this.foodWeight,
      "foodCategory": {
        "name": this.modalSelectedFoodCategoryOption
      },
      "restaurantList": this.modalRestaurantList
    }

    this.foodService.insertFood(food).subscribe(data => {
      console.warn(data.status);
      if(data.status === 201) {
        this.openInfoModal('New food', 'New food created!');
        this.updateFoodPage();

        if(this.uploadStatus == 'OK') {
          this.imageService.setImage(data.body, this.uploadedImageResponseObject.resourceName).subscribe(data => {
            if(data.status === 200) {
              this.updateFoodPage();
              console.warn('Image update successful.');
            }
            else {
              console.error('Error on image update.');
            }
          });
        }
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

    this.foodService.updateFood(food).subscribe(data => {
      if(data.status === 200) {
        this.openInfoModal('Update food', 'Food updated!');

        if(this.uploadStatus == 'OK') {
          this.imageService.setImage(food, this.uploadedImageResponseObject.resourceName).subscribe(data => {
            if(data.status === 200) {
              this.updateFoodPage();
              console.warn('Image update successful.');
            }
            else {
              console.error('Error on image update.');
            }
          });
        }
      }
    });
  }

  // region Image upload
  onImageUpload(event: any): void {
    if(event.target.files[0].size > 1000000) {
      this.uploadStatus = 'ERROR';
    }
    else {
      this.uploadedImage = event.target.files[0];
      this.uploadStatus = '';
    }
  }

  imageUploadAction(): void {
    this.imageService.postImage(this.uploadedImage).subscribe((data) => {
        if (data.status === 200) {
          this.uploadStatus = 'OK';
          this.uploadedImageResponseObject = data.body.image;
          this.recognizeFood();
        }
        else {
          this.uploadStatus = 'ERROR';
        }
      }
    );
  }

  getImageUrl(imageUUID: string): string {
    return this.imageService.getImageUrl(imageUUID);
  }

  resetModalImage(): void {
    this.uploadedImage = undefined;
    this.uploadStatus = '';
    this.uploadedImageResponseObject = undefined;
    this.foodImage = null;
    this.foodPrediction = '';
  }

  resetModalFields() {
    this.foodId = -1;
    this.foodName = '';
    this.foodDescription = '';
    this.foodPrice = '';
    this.foodWeight = '';
  }

  getResourceImageOfFoodImage(foodImage: any): string {
    return foodImage.resourceName;
  }
  // endregion

  recognizeFood(): void {
    console.warn('RECOGNIZING FOOD...');
    this.imageService.recognizeFood(this.uploadedImageResponseObject.resourceName).subscribe(data => {
      this.foodPrediction = data.body.prediction;
    })
  }

  openInfoModal(title: string, message: string): void {
    this.infoModalTitle = title;
    this.infoModalMessage = message;
    this.modalService.open(this.infoModal, {centered: true, size: 'md'});
  }

  // region Event listener

  receiveEvent($event: any): void {
    console.warn($event);
    if($event.source === 'restaurant-section') {
      this.restaurantService.getRestaurants().subscribe(data => {
        this.restaurantList = data;
        this.updateFoodPage();
      });
    }

    this.openInfoModal($event.title, $event.message);
  }
  // endregion Event listener

}
