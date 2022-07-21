import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RestaurantService} from "../../service/restaurant.service";
import {ManagerService} from "../../service/manager.service";
import {StaffService} from "../../service/staff.service";
import {DeliveryUserService} from "../../service/delivery-user.service";

enum AdminMenu {
  RESTAURANTS,
  MANAGERS,
  STAFF,
  DELIVERY_USERS,
  USERS
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  menuOption: AdminMenu = AdminMenu.RESTAURANTS;

  //#region Restaurant Field
  restaurantList: any;

  restaurantId: number = 0;

  restaurantName: string = '';
  restaurantDescription: string = '';

  streetAddress: string = '';
  city: string = '';
  zipCode: string = '';

  restaurantModalUpdate: boolean = false;
  //#endregion

  //#region Managers
  managerList: any;

  managerId: number = 0;

  managerFirstName: string = '';
  managerLastName: string = '';
  managerEmail: string = '';
  managerUsername: string = '';
  managerPassword: string = '';

  managerModalUpdate: boolean = false;
  //#endregion Managers

  //#region Staff
  staffList: any;

  staffId: number = 0;

  staffFirstName: string = '';
  staffLastName: string = '';
  staffEmail: string = '';
  staffUsername: string = '';
  staffPassword: string = '';

  staffModalUpdate = false;
  //#endregion

  //#region Delivery User
  deliveryUserList: any;

  deliveryUserId: number = 0;

  deliveryUserFirstName: string = '';
  deliveryUserLastName: string = '';
  deliveryUserEmail: string = '';
  deliveryUserUsername: string = '';
  deliveryUserPassword: string = '';

  deliveryUserVehicleManufacturer: string = '';
  deliveryUserVehicleNumber: string = '';
  deliveryUserVehicleColor: string = '';
  deliveryUserPhoneNumber: string = '';

  deliveryUserModalUpdate = false;
  //#endregion Delivery User

  constructor(private authenticationService: AuthenticationService,
              private modalService: NgbModal,
              private restaurantService: RestaurantService,
              private managerService: ManagerService,
              private staffService: StaffService,
              private deliveryUserService: DeliveryUserService) {
    this.restaurantService.getRestaurants().subscribe(data => {
      this.restaurantList = data;
    });
    this.managerService.getManagers().subscribe(data => {
      this.managerList = data;
    });
    this.staffService.getAllStaff().subscribe(data => {
      this.staffList = data;
    });
    this.deliveryUserService.getAllDeliveryUsers().subscribe(data => {
      this.deliveryUserList = data;
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

  getAdminMenu(): typeof AdminMenu {
    return AdminMenu;
  }

  getAvatarPath(): string {
    return Properties.avatar_path;
  }

  getUsername(): string {
    return this.authenticationService.getUsernameOfAccessToken();
  }

  changeOption(option: AdminMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'md'});
  }

  //#region Restaurant methods
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
        this.restaurantList.push(restaurant);
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
      }
    });
  }

  deleteRestaurant(restaurant: any): void {
    this.restaurantService.deleteRestaurant(restaurant.id).subscribe(data => {
      if(data.status === 200) {
        this.restaurantList.splice(this.restaurantList.findIndex((i: { id: any; }) => i.id === restaurant.id), 1);
      }
    });
  }
  //#endregion Restaurant methods

  //#region Manager methods
  resetManagerModel() {
    this.managerFirstName = '';
    this.managerLastName = '';
    this.managerEmail = '';
    this.managerUsername = '';
    this.managerPassword = '';
  }

  updateManagerModel(manager: any) {
    this.managerId = manager.id;

    this.managerFirstName = manager.firstName;
    this.managerLastName = manager.lastName;
    this.managerEmail = manager.email;
    this.managerUsername = manager.username;
    this.managerPassword = '';
  }

  insertManager(): void {
    const manager = {
      firstName: this.managerFirstName,
      lastName: this.managerLastName,
      email: this.managerEmail,
      username: this.managerUsername,
      password: this.managerPassword
    };

    this.managerService.insertManager(manager).subscribe(data => {
      if(data.status === 201) {
        this.managerList.push(manager);
      }
    });
  }

  updateManager(): void {
    const manager = {
      id: this.managerId,
      firstName: this.managerFirstName,
      lastName: this.managerLastName,
      email: this.managerEmail,
      username: this.managerUsername,
      password: this.managerPassword
    };

    this.managerService.updateManager(manager).subscribe(data => {
      if(data.status === 200) {
        this.managerList[this.managerList.findIndex((i: { id: any; }) => i.id === manager.id)] = manager;
      }
    });
  }

  deleteManager(manager: any): void {
    this.managerService.deleteManager(manager.id).subscribe(data => {
      if(data.status === 200) {
        this.managerList.splice(this.managerList.findIndex((i: { id: any; }) => i.id === manager.id), 1);
      }
    });
  }
  //#endregion Manager methods

  //#region Staff methods
  resetStaffModel() {
    this.staffFirstName = '';
    this.staffLastName = '';
    this.staffEmail = '';
    this.staffUsername = '';
    this.staffPassword = '';
  }

  updateStaffModel(staff: any) {
    this.staffId = staff.id;

    this.staffFirstName = staff.firstName;
    this.staffLastName = staff.lastName;
    this.staffEmail = staff.email;
    this.staffUsername = staff.username;
    this.staffPassword = '';
  }

  insertStaff(): void {
    const staff = {
      firstName: this.staffFirstName,
      lastName: this.staffLastName,
      email: this.staffEmail,
      username: this.staffUsername,
      password: this.staffPassword
    };

    this.staffService.insertStaff(staff).subscribe(data => {
      if(data.status === 201) {
        this.staffList.push(staff);
      }
    });
  }

  updateStaff(): void {
    const staff = {
      id: this.staffId,
      firstName: this.staffFirstName,
      lastName: this.staffLastName,
      email: this.staffEmail,
      username: this.staffUsername,
      password: this.staffPassword
    };

    this.staffService.updateStaff(staff).subscribe(data => {
      if(data.status === 200) {
        this.staffList[this.staffList.findIndex((i: { id: any; }) => i.id === staff.id)] = staff;
      }
    });
  }

  deleteStaff(staff: any): void {
    this.staffService.deleteStaff(staff.id).subscribe(data => {
      if(data.status === 200) {
        this.staffList.splice(this.staffList.findIndex((i: { id: any; }) => i.id === staff.id), 1);
      }
    });
  }
  //#endregion

  //#region Delivery User methods
  resetDeliveryUserModel() {
    this.deliveryUserFirstName = '';
    this.deliveryUserLastName = '';
    this.deliveryUserEmail = '';
    this.deliveryUserUsername = '';
    this.deliveryUserPassword = '';

    this.deliveryUserVehicleManufacturer = '';
    this.deliveryUserVehicleNumber = '';
    this.deliveryUserVehicleColor = '';
    this.deliveryUserPhoneNumber = '';
  }

  updateDeliveryUserModel(deliveryUser: any) {
    this.deliveryUserId = deliveryUser.id;

    this.deliveryUserFirstName = deliveryUser.firstName;
    this.deliveryUserLastName = deliveryUser.lastName;
    this.deliveryUserEmail = deliveryUser.email;
    this.deliveryUserUsername = deliveryUser.username;
    this.deliveryUserPassword = '';

    this.deliveryUserVehicleManufacturer = deliveryUser.vehicleManufacturer;
    this.deliveryUserVehicleNumber = deliveryUser.vehicleNumber;
    this.deliveryUserVehicleColor = deliveryUser.vehicleColor;
    this.deliveryUserPhoneNumber = deliveryUser.phoneNumber;
  }

  insertDeliveryUser(): void {
    const deliveryUser = {
      firstName: this.deliveryUserFirstName,
      lastName: this.deliveryUserLastName,
      email: this.deliveryUserEmail,
      username: this.deliveryUserUsername,
      password: this.deliveryUserPassword,

      vehicleManufacturer: this.deliveryUserVehicleManufacturer,
      vehicleNumber: this.deliveryUserVehicleNumber,
      vehicleColor: this.deliveryUserVehicleColor,
      phoneNumber: this.deliveryUserPhoneNumber
    };

    this.deliveryUserService.insertDeliveryUser(deliveryUser).subscribe(data => {
      if(data.status === 201) {
        this.deliveryUserList.push(deliveryUser);
      }
    });
  }

  updateDeliveryUser(): void {
    const deliveryUser = {
      id: this.deliveryUserId,
      firstName: this.deliveryUserFirstName,
      lastName: this.deliveryUserLastName,
      email: this.deliveryUserEmail,
      username: this.deliveryUserUsername,
      password: this.deliveryUserPassword,

      vehicleManufacturer: this.deliveryUserVehicleManufacturer,
      vehicleNumber: this.deliveryUserVehicleNumber,
      vehicleColor: this.deliveryUserVehicleColor,
      phoneNumber: this.deliveryUserPhoneNumber
    };

    this.deliveryUserService.updateDeliveryUser(deliveryUser).subscribe(data => {
      if(data.status === 200) {
        this.deliveryUserList[this.deliveryUserList.findIndex((i: { id: any; }) => i.id === deliveryUser.id)] = deliveryUser;
      }
    });
  }

  deleteDeliveryUser(deliveryUser: any): void {
    this.deliveryUserService.deleteDeliveryUser(deliveryUser.id).subscribe(data => {
      if(data.status === 200) {
        this.deliveryUserList.splice(this.deliveryUserList.findIndex((i: { id: any; }) => i.id === deliveryUser.id), 1);
      }
    });
  }
  //#endregion Delivery User methods
}
