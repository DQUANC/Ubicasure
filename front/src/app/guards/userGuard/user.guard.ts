import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
  private router:Router,
  private userRest:UserRestService
  ){}
  
  canActivate(){
    if(this.userRest.getToken() != ''){
      return true
    }else{
      this.router.navigateByUrl('');
      return false
    }
  }
}
