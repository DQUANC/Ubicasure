import { Component, OnInit } from '@angular/core';
import { StationModel } from 'src/app/models/station.model';
import { StationRestService } from 'src/app/services/stationRest/station-rest.service';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-policia-municipal',
  templateUrl: './policia-municipal.component.html',
  styleUrls: ['./policia-municipal.component.css']
})
export class PoliciaMunicipalComponent implements OnInit {
  map:any;
  marker =new google.maps.Marker;
  stationModel: StationModel;
  stationUpdated:any;
  station:any;
  infoWindow:any;
  open:any;
  listener:any;
  role:any;
  id:any;

  constructor(
    private stationRest: StationRestService,
    private userRest: UserRestService
    ) { 
    this.stationModel = new StationModel('',0,0,'','Policia Municipal','','',0,'','');
  }

  ngOnInit(): void {
    this.role = this.userRest.getIdentity().role;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var map = new google.maps.Map(document.getElementById('map') as HTMLElement,
        {
          zoom: 14,
          center: pos,
          mapId: 'c7ce922149e4c42d'
        });
        
        this.initMap(map);
        this.set(map);
        this.getStations(map);

      const locationButton = document.createElement("button");
          locationButton.id = 'center'
          locationButton.textContent = "Centrar Mapa";
          locationButton.title = 'Centra el mapa'
          locationButton.classList.add("custom-map-control-button");
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
        
          locationButton.addEventListener("click", () => {
                  map.setOptions({
                    center: pos,
                    zoom: 14
                  })
              })
          if(this.role == 'ADMIN'){
            let agregar = document.getElementById('Abutton') as HTMLButtonElement;
          
            agregar.classList.add("custom-map-control-button");
            agregar.title = 'Agrega una estación'
            map.controls[1].push(agregar);
          }
      });
  }

  set(map:any){
    this.map = map;
  }

  address(map:any){
    
    if(this.listener){}else{
      
      this.listener = google.maps.event.addListener( map, "click", (ele:any) => {
        this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: map,
            position: ele.latLng
        });
        this.stationModel.lat = ele.latLng.lat();
        this.stationModel.lng = ele.latLng.lng();
      });
    }
    
  }

  createStation(createStationForm:any){
    this.stationRest.createStation(this.stationModel).subscribe({
      next: (res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
        createStationForm.reset();
        google.maps.event.removeListener(this.listener);
        this.listener = undefined;
        this.marker.setMap(null);
        setTimeout(()=>{
          this.stationModel.type = 'Policia Municipal';
        },1000);
        
        this.getStations(this.map);
      },
      error: (err)=> {
        console.error();
        Swal.fire({
          title:  err.error.message ||err.error ,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        })
      }
    })
  }

  initMap(map:any) {
    var service;

    var coords={
      lat: 14.6465219,
      lng: -90.5352448
    }
    var request: any = {
      location: coords,
      map,
      name: 'Policia Municipal',
      radius: 5000
    };
    var coords1 = {
      lat:14.652111, 
      lng:-90.593456
    }
    var request1: any = {
      location: coords1,
      map,
      name: 'Policia Municipal',
      radius: 4000
    };
    var coords2:any ={
      lat:14.547564, 
      lng:-90.562434
    };
    var request2: any = {
      location: coords2,
      map,
      name: 'Policia Municipal',
      radius: 4000
    };
    var coords3:any = {
      lat:14.563847,
      lng:-90.487933
    };
    var request3: any = {
      location: coords3,
      map,
      name: 'Policia Municipal',
      radius: 4000
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request,
      (results: any, status: any) =>{
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            this.createMarkerV(results[i]);
          }
        }
      });

    service.nearbySearch(request1, (results: any, status: any) =>{
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarkerV(results[i]);
        }
      }
    });
    service.nearbySearch(request2, (results: any, status: any) =>{
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarkerV(results[i]);
        }
      }
    });
    service.nearbySearch(request3, (results: any, status: any) =>{
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarkerV(results[i]);
        }
      }
    });
  }

  createMarkerV(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry.location) return;
    if (place.name?.toLowerCase().includes('policía nacional') ||
    place.name?.toLowerCase().includes('pnc') ||
    place.name?.toLowerCase().includes('policia nacional'))return;

    var infowindow:any;
    var map =  this.map;
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: '../../assets/img/municipalPolice.png',
      optimized: true,
      animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(marker, "click", () => {
      if(this.infoWindow){
        this.infoWindow.close();
      }
      let id:any = {placeId: place.place_id};

      new google.maps.places.PlacesService(map).getDetails(id,(result:any)=>{
        if(!result.rating){
          result.rating = ''
        }if(!result.formatted_phone_number){
          result.formatted_phone_number = ''
        }else{
          result.formatted_phone_number = `<b>Télefono:</b> ${result.formatted_phone_number}`;
        }if(!result.rating || result.rating == undefined){
          result.rating = ''
        }else{
          result.rating = `<b>Clasificación:</b> ${result.rating}`;
        }if(!result.opening_hours){
          var horario = '';
          result.opening_hours = '';
        }else{
          horario =`<h3><b>Horario:</b></h3>`
          result.opening_hours = result.opening_hours.weekday_text;
          if(result.opening_hours.toString().includes(',')){
            result.opening_hours = result.opening_hours.toString().replace(/,/g, '<br>');
          }
          
        }

        let content =
        `<h3><b>Nombre:</b> ${result.name}</h3>`+
        `<h3><b>Dirección:</b> ${result.adr_address}</h3>`+
        `<h3>${result.formatted_phone_number}</h3>`+
        `<h3>${result.rating}</h3>`+
        `${horario}<h4>${result.opening_hours}</h4>`
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.open({
          anchor: marker,
          map
        });
        this.infoWindow = infowindow;
      });
    });
  }

  deleteStation(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.stationRest.deleteStation(this.station._id).subscribe({
          next:(res:any)=>{
              Swal.fire({
                title:'Deleted!',
                text:res.message,
                icon:'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
              });
              this.getStations(this.map);
              this.infoWindow.close();
              this.open.setMap(null);
          },
          error:(err)=>{
            Swal.fire({
            title: err.error.message || err.error,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
            });
          }
        });
      }
    })
  }
  updateStation(){
    this.stationUpdated.user = undefined, this.stationUpdated.address = undefined,
    this.stationUpdated.lat = undefined, this.stationUpdated.lng = undefined;
    
    this.stationRest.updateStation(this.stationUpdated._id,this.stationUpdated).subscribe({
      next: (res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
        this.infoWindow.close();
        this.id = this.stationUpdated._id;
        this.getStations(this.map);
      },
      error: (err)=>{
        console.error();
        Swal.fire({
          title:  err.error.message ||err.error ,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        })
      }
    })
  }
  
  createMarker(location:any, place: any,map:any) {
    var infowindow:any;
    
    const marker = new google.maps.Marker({
      map,
      position: location,
      icon: '../../assets/img/municipalPolice.png',
      optimized: true,
      animation: google.maps.Animation.DROP
    });
    let content:any;
      if(this.userRest.getIdentity().role == 'ADMIN'){
        if(place.businessHours.includes(',')){
          place.businessHours = place.businessHours.toString().replace(/,/g, '<br>');
        }
        content =
        `<h3><b>Nombre:</b> ${place.name}</h3>`+
        `<h3><b>Dirección:</b> ${place.address}</h3>`+
        `<h3><b>Teléfono:</b> ${place.phone}</h3>`+
        `<h3><b>Clasificación:</b> ${place.rating}</h3>`+
        `<h3>Horario:<br></h3><h4>${place.businessHours}</h4>`+
        `<h3><b>Administrador que la creo:</b> ${place.user.name}</h3>`+
        `<button id="get" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"
        aria-controls="offcanvas" type="button" class="btn btn-primary">Actualizar</button>`+
        `<button id="delete" type="button" class="btn btn-danger ms-3">Borrar</button>`
      }else{
        content =
        `<h3><b>Nombre:</b> ${place.name}</h3>`+
        `<h3><b>Dirección:</b> ${place.address}</h3>`+
        `<h3><b>Teléfono:</b> ${place.phone}</h3>`+
        `<h3><b>Clasificación:</b> ${place.rating}</h3>`+
        `<h3>Horario:<br></h3><h4>${place.businessHours}</h4>`+
        `<h3><b>Administrador que la creo:</b> ${place.user.name}</h3>`
      }
    google.maps.event.addListener(marker, "click", () => {
      if(this.infoWindow){
        this.infoWindow.close();
      }
        setTimeout(()=>{
          document.getElementById('get')?.addEventListener("click", ()=>{
            this.stationUpdated = place;
            this.infoWindow = infowindow;
            this.open = marker;
          });
          
          document.getElementById('delete')?.addEventListener("click", ()=>{
            this.station = place;
            this.infoWindow = infowindow;
            this.open = marker;
            this.deleteStation();
          });
        },500);
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.open({
          anchor: marker,
          map
        });
        this.infoWindow = infowindow;
      });

      if(this.id == place._id){
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.open({
          anchor: marker,
          map
        });
        this.infoWindow = infowindow;
        this.id=undefined;
      }
  }

  getStations(map:any){
    
    this.stationRest.getMunicipalStationsP().subscribe({
      next:(res:any)=>{
            
            for (let station of res.stations) {
              var location ={
                lat: station.lat,
                lng: station.lng
              }
              this.createMarker(location,station,map);
            }
      },
      error: (err)=>{

      }
    })
  }
}
