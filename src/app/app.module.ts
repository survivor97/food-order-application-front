import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ContentComponent} from './content/content.component';
import {LoginComponent} from './content/login/login.component';
import {HomeComponent} from './content/home/home.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from "./service/authentication.service";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginService} from "./service/login.service";
import {InterceptorService} from "./service/interceptor.service";
import {RestaurantService} from "./service/restaurant.service";
import {AdminComponent} from './content/admin/admin.component';
import {RegisterComponent} from './content/register/register.component';
import {ManagerComponent} from './content/manager/manager.component';
import {DeliveryComponent} from './content/delivery/delivery.component';
import {ProfileComponent} from './content/profile/profile.component';
import {StaffComponent} from './content/staff/staff.component';
import {FoodService} from "./service/food.service";
import {CartComponent} from './content/cart/cart.component';
import {OrderService} from "./service/order.service";
import {ManagerService} from "./service/manager.service";
import {StaffService} from "./service/staff.service";
import {DeliveryUserService} from "./service/delivery-user.service";
import {StaffSectionComponent} from './content/sections/staff-section/staff-section.component';
import {RestaurantSectionComponent} from './content/sections/restaurant-section/restaurant-section.component';
import {ManagerSectionComponent} from './content/sections/manager-section/manager-section.component';
import {DeliveryUserSectionComponent} from './content/sections/delivery-user-section/delivery-user-section.component';
import {UserService} from "./service/user.service";
import {WaitingComponent} from './waiting/waiting.component';
import {Utilities} from "./utilities";
import {StompService} from "./service/websocket/stomp.service";
import { AccountDropdownComponent } from './content/sections/account-dropdown/account-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    RegisterComponent,
    ManagerComponent,
    DeliveryComponent,
    ProfileComponent,
    StaffComponent,
    CartComponent,
    StaffSectionComponent,
    RestaurantSectionComponent,
    ManagerSectionComponent,
    DeliveryUserSectionComponent,
    WaitingComponent,
    Utilities,
    AccountDropdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationService,
    LoginService,
    RestaurantService,
    FoodService,
    OrderService,
    ManagerService,
    StaffService,
    DeliveryUserService,
    UserService,
    StompService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
