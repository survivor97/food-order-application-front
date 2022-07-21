import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StaffService} from "../../../service/staff.service";

@Component({
  selector: 'app-staff-section',
  templateUrl: './staff-section.component.html',
  styleUrls: ['./staff-section.component.css']
})
export class StaffSectionComponent implements OnInit {

  staffList: any;

  staffId: number = 0;

  staffFirstName: string = '';
  staffLastName: string = '';
  staffEmail: string = '';
  staffUsername: string = '';
  staffPassword: string = '';

  staffModalUpdate = false;

  constructor(private staffService: StaffService,
              private modalService: NgbModal) {
    this.staffService.getAllStaff().subscribe(data => {
      this.staffList = data;
    });
  }

  ngOnInit(): void {
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'md'});
  }

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

}
