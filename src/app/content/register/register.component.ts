import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../service/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('infoModal') infoModal: any;

  infoModalTitle: string = '';
  infoModalMessage: string = '';

  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  passwordConfirm: string = '';

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  registerUser(): void {

    //Incorrect data
    if(
        this.firstName === '' ||
        this.lastName === '' ||
        this.phoneNumber === '' ||
        this.email === '' ||
        this.username === '' ||
        this.password === '' ||
        this.passwordConfirm === ''
    ) {
      this.infoModalTitle = 'Incomplete Fields';
      this.infoModalMessage = 'Please complete all fields!'
      this.openModal(this.infoModal);
    }

    else if(this.password !== this.passwordConfirm) {
      this.infoModalTitle = 'Password';
      this.infoModalMessage = 'Passwords don\'t match!'
      this.openModal(this.infoModal);
    }

    //All ok
    const user = {
      "firstName": this.firstName,
      "lastName": this.lastName,
      "phoneNumber": this.phoneNumber,
      "email": this.email,
      "username": this.username,
      "password": this.password
    }

    this.userService.registerUser(user).subscribe(data => {
      if(data.status === 201) {
        this.authenticationService.login(user.username, user.password);
      }
    });

  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

}
