import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class StationRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');
  
  constructor(
    private http: HttpClient,
    private fireAuth: AngularFireAuth,
    private userRest:UserRestService
    ) { }

  createStation(params:{}){
    return this.http.post(environment.baseUri + 'station/createStation', params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  getVolunteerStationsF(){
    return this.http.get(environment.baseUri + 'station/getVolunteerStationsF', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  getStations(){
    return this.http.get(environment.baseUri + 'station/getStations', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  getMunicipalStationsF(){
    return this.http.get(environment.baseUri + 'station/getMunicipalStationsF', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  getFireStations(){
    return this.http.get(environment.baseUri + 'station/getFireStations', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }
  
  getPoliceStations(){
    return this.http.get(environment.baseUri + 'station/getPoliceStations', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  getNationalStationsP(){
    return this.http.get(environment.baseUri + 'station/getNationalStationsP', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  getMunicipalStationsP(){
    return this.http.get(environment.baseUri + 'station/getMunicipalStationsP', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  updateStation(id:string,params:{}){
    return this.http.put(environment.baseUri + 'station/updateStation/' + id, params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())}) 
  }

  deleteStation(id:string){
    return this.http.delete(environment.baseUri + 'station/deleteStation/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

}
