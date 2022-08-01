import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService, OrderStatus} from "../../service/order.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

enum DeliveryMenu {
  NEW_ORDERS,
  ACTIVE_ORDER
}

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  menuOption: DeliveryMenu = DeliveryMenu.NEW_ORDERS;

  pageLoaded: boolean = false;

  acceptedOrderList: any = [];
  activeOrder: any;
  activeOrderItemMap = new Map<number, any>();
  filteredOrderFood: any = [];

  // region selected modal food
  selectedOrderModal: any;
  mappedSelectedOrder: any = new Map<number, any>();
  filteredSelectedOrderFood: any = [];
  // endregion selected modal food

  constructor(private authenticationService: AuthenticationService,
              private orderService: OrderService,
              private modalService: NgbModal) {
      this.updateAvailableOrderList();
      this.getActiveOrder();
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

  getDeliveryMenu(): typeof DeliveryMenu {
    return DeliveryMenu;
  }

  changeOption(option: DeliveryMenu): void {
    this.menuOption = option;
    window.scrollTo(0, 0);
  }

  updateAvailableOrderList(): void {
    this.pageLoaded = false;

    this.orderService.getAccepterOrders().subscribe(data => {
      if(Array.isArray(data)) {
        this.acceptedOrderList = data.filter(order => order.deliveryUser == null);
        console.warn(this.acceptedOrderList);
      }
      this.pageLoaded = true;
    });
  }

  takeOrder(order: any) {
    this.pageLoaded = false;

    this.orderService.takeOrder(order).subscribe(data => {
      if(data.status === 200) {
        console.warn("Order taken successfully!");
        this.updateAvailableOrderList();
        this.getActiveOrder();
      }
    });
  }

  setDelivered(order: any) {
    this.orderService.setOrderDelivered(order).subscribe(data => {
      if(data.status === 200) {
        console.warn("Order delivered successfully!");
        this.updateAvailableOrderList();
        this.activeOrder = null;
        this.changeOption(DeliveryMenu.NEW_ORDERS);
      }
    });
  }

  getActiveOrder() {
    this.orderService.getActiveOrder().subscribe(data => {
      console.warn(data);
      this.activeOrder = data;

      if(data != null) {
        this.mapActiveOrderItems();
      }
    })
  }

  canBeDelivered(): boolean {
    return this.activeOrder.orderStatus === OrderStatus[OrderStatus.ON_THE_WAY.valueOf()];
  }

  mapActiveOrderItems(): void {

    this.activeOrder.foodList.forEach((data: any) => {
      if(this.activeOrderItemMap.get(data.id) == null) {
        data.quantity = 1;
        this.activeOrderItemMap.set(data.id, data);
      }
      else {
        this.activeOrderItemMap.get(data.id).quantity++;
      }
    });

    let seenItems: any = {};

    this.filteredOrderFood = this.activeOrder.foodList.filter((data: any) => {
      return seenItems.hasOwnProperty(data.id) ? false : (seenItems[data.id] = true);
    });

  }

  getMappedQuantity(food: any, map: any): number {
    return map.get(food.id).quantity;
  }

  getCartTotal(order: any): number {
    let total = 0;

    order.foodList.forEach((food: any) => {
      total += parseInt(food.price);
    });

    return total;
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  selectModalOrder(order: any) {
    this.selectedOrderModal = order;
    this.mapSelectedOrder(order);
  }

  mapSelectedOrder(order: any): void {

    this.mappedSelectedOrder = new Map<number, any>();

    order.foodList.forEach((data: any) => {
      if(this.mappedSelectedOrder.get(data.id) == null) {
        data.quantity = 1;
        this.mappedSelectedOrder.set(data.id, data);
      }
      else {
        this.mappedSelectedOrder.get(data.id).quantity++;
      }
    });

    let seenItems: any = {};

    this.filteredSelectedOrderFood = order.foodList.filter((data: any) => {
      return seenItems.hasOwnProperty(data.id) ? false : (seenItems[data.id] = true);
    });
  }

  getFormattedDate(inputDate: string) {
    const date: Date = new Date(inputDate);
    const dateString: string = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
    const timeString: string = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    return dateString + ' ' + timeString;
  }

}