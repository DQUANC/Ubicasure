import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthStorageService } from '../auth-storage/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  getToken(): string {
    return this.authStorage.getToken();
  }

  getIdentity(): any {
    return this.authStorage.getIdentity();
  }

  constructor(
    private http: HttpClient,
    private fireAuth: AngularFireAuth,
    private authStorage: AuthStorageService
  ) { }

  register(params: {}){
    return this.http.post(environment.baseUri + 'user/register', params, {headers: this.httpOptions});
  }

  login(params: {}){
    return this.http.post(environment.baseUri + 'user/login', params, {headers: this.httpOptions});
  }

  logOut(){
    this.authStorage.clearAll();
    this.fireAuth.signOut();
  }
}
