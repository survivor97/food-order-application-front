import { Component, OnInit } from '@angular/core';
import {ManagerService} from "../../../service/manager.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-manager-section',
  templateUrl: './manager-section.component.html',
  styleUrls: ['./manager-section.component.css']
})
export class ManagerSectionComponent implements OnInit {

  managerList: any;

  managerId: number = 0;

  managerFirstName: string = '';
  managerLastName: string = '';
  managerEmail: string = '';
  managerUsername: string = '';
  managerPassword: string = '';

  managerModalUpdate: boolean = false;

  constructor(private managerService: ManagerService,
              private modalService: NgbModal) {
    this.managerService.getManagers().subscribe(data => {
    this.managerList = data;
  });}

  ngOnInit(): void {
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'md'});
  }

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

}
