import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./content/login/login.component";
import {HomeComponent} from "./content/home/home.component";
import {AdminComponent} from "./content/admin/admin.component";
import {AuthGuardService} from "./service/auth-guard.service";
import {RegisterComponent} from "./content/register/register.component";
import {ManagerComponent} from "./content/manager/manager.component";
import {DeliveryComponent} from "./content/delivery/delivery.component";
import {ProfileComponent} from "./content/profile/profile.component";
import {StaffComponent} from "./content/staff/staff.component";
import {CartComponent} from "./content/cart/cart.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'delivery',
    component: DeliveryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'staff',
    component: StaffComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
