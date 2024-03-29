import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {RestaurantService} from "../../../service/restaurant.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-restaurant-section',
  templateUrl: './restaurant-section.component.html',
  styleUrls: ['./restaurant-section.component.css']
})
export class RestaurantSectionComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter<any>();

  pageLoaded = false;
  restaurantList: any;

  restaurantId: number = 0;

  restaurantName: string = '';
  restaurantDescription: string = '';

  streetAddress: string = '';
  city: string = '';
  zipCode: string = '';

  restaurantModalUpdate: boolean = false;

  constructor(private restaurantService: RestaurantService,
              private modalService: NgbModal) {
    this.restaurantService.getRestaurants().subscribe(data => {
      this.restaurantList = data;
      this.pageLoaded = true;
    });
  }

  ngOnInit(): void {
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'md'});
  }

  updateRestaurantModel(restaurant: any) {
    this.restaurantId = restaurant.id;
    this.restaurantName = restaurant.name;
    this.restaurantDescription = restaurant.description;

    if(restaurant.address == null) {
      this.streetAddress = '';
      this.city = '';
      this.zipCode = '';
      return;
    }

    this.streetAddress = restaurant.address.streetAddress;
    this.city = restaurant.address.city;
    this.zipCode = restaurant.address.zipCode;
  }

  resetRestaurantModel() {
    this.restaurantName = '';
    this.restaurantDescription = '';
    this.streetAddress = '';
    this.city = '';
    this.zipCode = '';
  }

  insertRestaurant(): void {
    const restaurant = {
      id: null,
      name: this.restaurantName,
      description: this.restaurantDescription,
      address: {
        streetAddress: this.streetAddress,
        city: this.city,
        zipCode: this.zipCode
      }
    };

    this.restaurantService.insert(restaurant).subscribe(data => {
      if(data.status === 201) {
        restaurant.id = data.body.id;
        this.restaurantList.push(restaurant);

        this.eventEmitter.emit({
          'source': 'restaurant-section',
          'title': 'New Restaurant',
          'message': 'Restaurant inserted successfully!'
        });
      }
    });
  }

  updateRestaurant(): void {
    const restaurant = {
      id: this.restaurantId,
      name: this.restaurantName,
      description: this.restaurantDescription,
      address: {
        streetAddress: this.streetAddress,
        city: this.city,
        zipCode: this.zipCode
      }
    };

    this.restaurantService.updateRestaurant(restaurant).subscribe(data => {
      if(data.status === 200) {
        this.restaurantList[this.restaurantList.findIndex((i: { id: any; }) => i.id === restaurant.id)] = restaurant;

        this.eventEmitter.emit({
          'source': 'restaurant-section',
          'title': 'Update',
          'message': 'Restaurant updated successfully!'
        });
      }
    });
  }

  deleteRestaurant(restaurant: any): void {
    this.restaurantService.deleteRestaurant(restaurant.id).subscribe(data => {
      if(data.status === 200) {
        this.restaurantList.splice(this.restaurantList.findIndex((i: { id: any; }) => i.id === restaurant.id), 1);

        this.eventEmitter.emit({
          'source': 'restaurant-section',
          'title': 'Delete',
          'message': 'Restaurant deleted successfully!'
        });
      }
    });
  }

}
