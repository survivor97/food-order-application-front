import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService, OrderStatus} from "../../service/order.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

enum StaffMenu {
  PENDING,
  ACCEPTED,
  PREPARING
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  menuOption: StaffMenu = StaffMenu.PENDING;

  pageLoaded: boolean = false;

  receivedOrderList: any = [];
  acceptedOrderList: any = [];
  preparingOrderList: any = [];

  selectedOrderModal: any;
  mappedOrder: any = new Map<number, any>();
  filteredOrderFood: any = [];

  constructor(private authenticationService: AuthenticationService,
              private orderService: OrderService,
              private modalService: NgbModal) {
    this.updateOrderList();
  }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.authenticationService.getIsLoggedIn();
  }

  getAvatarPath(): string {
    return Properties.avatar_path;
  }

  getUsername(): string {
    return this.authenticationService.getUsernameOfAccessToken();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  getStaffMenu(): typeof StaffMenu {
    return StaffMenu;
  }

  changeOption(option: StaffMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }

  updateOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getOrderByStatus(OrderStatus.RECEIVED).subscribe(data => {
      this.receivedOrderList = data;
      this.pageLoaded = true;
    });
  }

  updateAcceptedOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getOrderByStatus(OrderStatus.ACCEPTED).subscribe(data => {
      this.acceptedOrderList = data;
      this.pageLoaded = true;
    });
  }

  updatePreparingOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getOrderByStatus(OrderStatus.PREPARING).subscribe(data => {
      this.preparingOrderList = data;
      this.pageLoaded = true;
    });
  }

  acceptOrder(order: any): void {
    this.orderService.acceptOrder(order).subscribe(data => {
      if(data.status === 200) {
        this.updateOrderList();
      }
    });
  }

  prepareOrder(order: any): void {
    this.orderService.prepareOrder(order).subscribe(data => {
      if(data.status === 200) {
        this.updateAcceptedOrderList();
      }
    });
  }

  shipOrder(order: any): void {
    this.orderService.shipOrder(order).subscribe(data => {
      if(data.status === 200) {
        this.updatePreparingOrderList();
      }
    });
  }

  rejectOrder(order: any): void {
    this.orderService.rejectOrder(order).subscribe(data => {
      if(data.status === 200) {
        if(this.menuOption === StaffMenu.PENDING) {
          this.updateOrderList();
        }
        else if(this.menuOption === StaffMenu.ACCEPTED) {
          this.updateAcceptedOrderList();
        }
        else if(this.menuOption === StaffMenu.PREPARING) {
          this.updatePreparingOrderList();
        }
      }
    });
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  selectModalOrder(order: any) {
    this.selectedOrderModal = order;
    this.mapOrder(order);
  }

  debugPrint(order: any) {
    console.warn(order);
  }

  mapOrder(order: any): void {

    this.mappedOrder = new Map<number, any>();

    order.foodList.forEach((data: any) => {
      if(this.mappedOrder.get(data.id) == null) {
        data.quantity = 1;
        this.mappedOrder.set(data.id, data);
      }
      else {
        this.mappedOrder.get(data.id).quantity++;
      }
    });

    let seenItems: any = {};

    this.filteredOrderFood = order.foodList.filter((data: any) => {
      return seenItems.hasOwnProperty(data.id) ? false : (seenItems[data.id] = true);
    });
  }

  getMappedQuantity(food: any): number {
    return this.mappedOrder.get(food.id).quantity;
  }

  getCartTotal(): number {
    let total = 0;

    this.selectedOrderModal.foodList.forEach((food: any) => {
      total += parseInt(food.price);
    });

    return total;
  }

  getFormattedDate(inputDate: string) {
    const date: Date = new Date(inputDate);
    const dateString: string = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
    const timeString: string = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    return dateString + ' ' + timeString;
  }

}
