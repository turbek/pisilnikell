import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule  } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';
import { AgmInfoWindow } from '@agm/core/directives/info-window';
import { NavbarComponent } from './navbar/navbar.component';


import { MdSliderModule, MdButtonModule, MdDialogModule, MdInputModule } from '@angular/material';
import { TextsComponent } from './texts/texts.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        TextsComponent,
        SuccessDialogComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        MdSliderModule,
        MdButtonModule,
        MdDialogModule,
        MdInputModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyA8rAZslIIpPxRswiU9as5k93kpGOQfXAw',
          libraries: ['places'],
          language: 'hu'
        })
    ],
    entryComponents: [ SuccessDialogComponent ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
