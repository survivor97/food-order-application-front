import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authenticationService.login(this.username, this.password);
  }

}
