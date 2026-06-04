import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  token:any;

  constructor(private userRest:UserRestService) { }

  ngOnInit(): void {
    this.token = this.userRest.getToken();
  }
}
