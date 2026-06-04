import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat'

import {GoogleMapsModule} from '@angular/google-maps';
import { PoliciaNacionalComponent } from './components/policia-nacional/policia-nacional.component';
import { PoliciaMunicipalComponent } from './components/policia-municipal/policia-municipal.component';
import { BomberosMunicipalesComponent } from './components/bomberos-municipales/bomberos-municipales.component';
import { BomberosVoluntariosComponent } from './components/bomberos-voluntarios/bomberos-voluntarios.component';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EstacionesPoliciaComponent } from './components/estaciones-policia/estaciones-policia.component';
import { EstacionesBomberosComponent } from './components/estaciones-bomberos/estaciones-bomberos.component';
import { BomberosComponent } from './components/bomberos/bomberos.component';
import { PoliciasComponent } from './components/policias/policias.component';
import { MapaGeneralComponent } from './components/mapa-general/mapa-general.component';
@NgModule({
  declarations: [
    AppComponent,
    PoliciaNacionalComponent,
    PoliciaMunicipalComponent,
    BomberosMunicipalesComponent,
    BomberosVoluntariosComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    EstacionesPoliciaComponent,
    EstacionesBomberosComponent,
    BomberosComponent,
    PoliciasComponent,
    MapaGeneralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
