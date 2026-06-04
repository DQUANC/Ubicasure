import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class UserRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  getToken(){
    let globalToken = localStorage.getItem('token');
    let token;
    if(globalToken != undefined){
      token = globalToken;
    }else{
      token = '';
    }
    return token;
  }

  getIdentity(){
    let globalIdentity = localStorage.getItem('identity');
    let identity;
    if(globalIdentity != undefined){
      identity = JSON.parse(globalIdentity);
    }else{
      identity = '';
    }
    return identity;
  }

  constructor(
    private http: HttpClient,
    private fireAuth: AngularFireAuth
    ) { }

  register(params:{}){
    return this.http.post(environment.baseUri + 'user/register', params, {headers: this.httpOptions});
  }

  login(params:{}){
    return this.http.post(environment.baseUri +  'user/login', params, {headers: this.httpOptions});
  }

  logOut(){
    this.fireAuth.signOut();
  }

}
