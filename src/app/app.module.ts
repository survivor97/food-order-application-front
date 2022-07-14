import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';
import { LoginComponent } from './content/login/login.component';
import { HomeComponent } from './content/home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from "./service/authentication.service";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginService} from "./service/login.service";
import {InterceptorService} from "./service/interceptor.service";
import {RestaurantService} from "./service/restaurant.service";
import { AdminComponent } from './content/admin/admin.component';
import { RegisterComponent } from './content/register/register.component';
import { ManagerComponent } from './content/manager/manager.component';
import { DeliveryComponent } from './content/delivery/delivery.component';
import { ProfileComponent } from './content/profile/profile.component';

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
    ProfileComponent
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
