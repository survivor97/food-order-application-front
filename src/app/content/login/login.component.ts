import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('infoModal') infoModal: any;

  infoModalTitle: string = '';
  infoModalMessage: string = '';

  username: string = '';
  password: string = '';

  constructor(private authenticationService: AuthenticationService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authenticationService.login(
        this.username,
        this.password,
        (): void => {
          this.failCallback();
        });
  }

  failCallback(): void {
    this.infoModalTitle = 'Login';
    this.infoModalMessage = 'Wrong username or password!';
    this.openModal(this.infoModal);
  }

  openModal(content: any): void {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

}
