import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import { AuthStorageService } from 'src/app/services/auth-storage/auth-storage.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  token: any;

  constructor(
    private userRest: UserRestService,
    private authStorage: AuthStorageService
  ) { }

  ngOnInit(): void {
    this.token = this.authStorage.getToken();
    setInterval(() => {
      this.token = this.authStorage.getToken();
    }, 1000);
  }

  logOut() {
    Swal.fire({
      title: 'Log out successfully',
      icon: 'success',
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    this.authStorage.clearAll();
  }
}
