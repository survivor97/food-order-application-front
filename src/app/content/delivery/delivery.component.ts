import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {Properties} from "../../properties";
import {OrderService, OrderStatus} from "../../service/order.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StompService} from "../../service/websocket/stomp.service";

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
              private modalService: NgbModal,
              private stompService: StompService) {
      this.updateAvailableOrderList();
      this.getActiveOrderAndUpdateAvailableList();
  }

  ngOnInit(): void {
    let topics: string[] = new Array('/topic/delivery-user', '/topic/delivery-user/' + this.authenticationService.getUsernameOfAccessToken());

    this.stompService.subscribe(topics,(message: string): void => {
      this.subscribeCallback(message);
    },(): void => {
    });
  }

  subscribeCallback(message: string): void {
    const responseMessage = JSON.parse(message);

    if(responseMessage.messageContent === 'new-order-available') {
      console.warn('NEW ORDER');
      if(this.menuOption === DeliveryMenu.NEW_ORDERS) {
        this.updateAvailableOrderList();
      }
    }

    if(responseMessage.messageContent === 'order-update') {
      console.warn('ORDER UPDATE');
      if(this.menuOption === DeliveryMenu.ACTIVE_ORDER) {
        this.getActiveOrderAndUpdateAvailableList();
      }
    }

    if(responseMessage.messageContent === 'order-rejected') {
      this.updateAvailableOrderList();
      this.activeOrder = null;
      this.changeOption(DeliveryMenu.NEW_ORDERS);
    }
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
      }
      this.pageLoaded = true;
    });
  }

  takeOrder(order: any) {
    this.pageLoaded = false;

    this.orderService.takeOrder(order).subscribe(data => {
      if(data.status === 200) {
        console.warn("Order taken successfully!");

        console.warn(data);

        if(data.body.orderStatus === 'PICK_READY') {
          console.warn("HERE 1");
          this.orderService.setOnTheWay(order).subscribe(() => {
            this.getActiveOrderAndUpdateAvailableList();
          });
        }
        else {
          console.warn("HERE 2");
          this.getActiveOrderAndUpdateAvailableList();
        }
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

  getActiveOrderAndUpdateAvailableList() {
    this.pageLoaded = false;

    this.orderService.getActiveOrder().subscribe(data => {
      this.activeOrder = data;

      if(data != null) {
        this.mapActiveOrderItems();
        console.warn("DATA : " );
        console.warn(this.activeOrderItemMap);
      }

      this.updateAvailableOrderList();
    })
  }

  canBeDelivered(): boolean {
    return this.activeOrder != null && this.activeOrder.orderStatus === OrderStatus[OrderStatus.ON_THE_WAY.valueOf()];
  }

  mapActiveOrderItems(): void {

    this.activeOrderItemMap = new Map<number, any>();

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

}