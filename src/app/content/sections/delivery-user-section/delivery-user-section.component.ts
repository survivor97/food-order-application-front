import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DeliveryUserService} from "../../../service/delivery-user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-delivery-user-section',
  templateUrl: './delivery-user-section.component.html',
  styleUrls: ['./delivery-user-section.component.css']
})
export class DeliveryUserSectionComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter<any>();

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

  constructor(private deliveryUserService: DeliveryUserService,
              private modalService: NgbModal) {
    this.deliveryUserService.getAllDeliveryUsers().subscribe(data => {
      this.deliveryUserList = data;
    });
  }

  ngOnInit(): void {
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'md'});
  }

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
      id: null,
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
        deliveryUser.id = data.body.id;
        this.deliveryUserList.push(deliveryUser);

        this.eventEmitter.emit({
          'source': 'delivery-user-section',
          'title': 'New Delivery User',
          'message': 'Delivery User inserted successfully!'
        });
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

        this.eventEmitter.emit({
          'source': 'delivery-user-section',
          'title': 'Delivery User Update',
          'message': 'Delivery User updated successfully!'
        });
      }
    });
  }

  deleteDeliveryUser(deliveryUser: any): void {
    this.deliveryUserService.deleteDeliveryUser(deliveryUser.id).subscribe(data => {
      if(data.status === 200) {
        this.deliveryUserList.splice(this.deliveryUserList.findIndex((i: { id: any; }) => i.id === deliveryUser.id), 1);

        this.eventEmitter.emit({
          'source': 'delivery-user-section',
          'title': 'Delivery User Removed',
          'message': 'Delivery User removed successfully!'
        });
      }
    });
  }

}
