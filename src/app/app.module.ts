import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule  } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';
import { NavbarComponent } from './navbar/navbar.component';


import {SliderModule,DataTableModule,SharedModule,ButtonModule} from 'primeng/primeng';
import { TextsComponent } from './texts/texts.component';


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        TextsComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        DataTableModule,
        SharedModule,
        SliderModule,
        ButtonModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyA8rAZslIIpPxRswiU9as5k93kpGOQfXAw'
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
