import { Component, NgModule, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {  AgmCoreModule, MapsAPILoader } from '@agm/core';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';

import "rxjs/add/operator/map";

declare var google: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    searchControl: FormControl;
    list: FirebaseListObservable<any[]>;
    title: string = 'pisilnikell';
    location = <Coordinates>{};
    lat: number = 47;
    lng: number = 19;
    maxDistance: number = 1000;
    distance: number = 200;
    zoom: number = 16;
    openedWindowLocation: {latitude: number, longitude: number};
    mainMarkerText: string = "Itt kell nagyon pisilned!"
    mainMarkerOpen: boolean = true;
    selectedOption: string;

    @ViewChild("search")
    searchElementRef: any;

    constructor(private db: AngularFireDatabase, private _loader: MapsAPILoader, private ngZone: NgZone, private dialog: MdDialog){
    }

    setPosition(position){
        this.location = position.coords;
        this.lat = this.location.latitude;
        this.lng = this.location.longitude;
    }

    ngOnInit(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
        };
        this.renderMessages();

        this.searchControl = new FormControl();

        //load Places Autocomplete
        this._loader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                componentRestrictions: {'country': 'HU'},
            });
        //   types: ["address"]
        autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
                //get the place result
                let place = autocomplete.getPlace();

                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                return;
                }

                //set latitude, longitude and zoom
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
                this.renderMessages();
                });
            });
        });
    }

    renderMessages(){
        this.list = this.db
            .list('/items', {
                query: {
                    orderByChild: 'upvote'
                }
            })
            .map(items => items.filter(item => this.isNear(item.location.lat, item.location.lng)))
            .map(items => items.sort((a, b) => b.upvote - a.upvote)) as FirebaseListObservable<any[]>;
    }

    add(HTMLinput: HTMLInputElement){
        this.list.push({
            text: HTMLinput.value,
            location: {lat: this.lat, lng: this.lng},
            upvote: 0
        });
        HTMLinput.value = null;
    }

    // TODO: MERGE THESE TWO IN ONE METHOD
    onUpvoteAdded(upvoteKeyObject){
        let temp: number = upvoteKeyObject.upvote;
        this.db.object('/items/'+upvoteKeyObject.key).update({
            upvote: temp += 1
        });
    }

    onUpvoteDeleted(upvoteKeyObject){
        let temp: number = upvoteKeyObject.upvote;
        this.db.object('/items/'+upvoteKeyObject.key).update({
            upvote: temp -= 1
        });
    }

    deleteItem(keyObject){
        this.db.object('/items/'+keyObject.key).remove()
            .then(x => console.log("item deleted! key:"+keyObject.key))
            .catch(error => console.log("ERROR with key:"+keyObject.key, error))
    }

    setMarkerPosition(coordsObject){
        this.lat = coordsObject.coords.lat;
        this.lng = coordsObject.coords.lng;
        this.openedWindowLocation = null;
    }

    calculateDistance(lat1: number, lon1: number){
        let radlat1 = Math.PI * lat1/180
        let radlat2 = Math.PI * this.lat/180
        let theta = lon1-this.lng
        let radtheta = Math.PI * theta/180
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        dist = dist * 1.609344
        return dist*1000;
    }

    isNear(lat1: number, lon1: number){
        return this.calculateDistance(lat1, lon1) <= this.distance;
    }

    howFar(lat1: number, lon1: number){
        return Math.floor(this.calculateDistance(lat1, lon1));
    }

    putOnMaps(lat1: number, lon1: number){
        return "https://www.google.com/maps/place/"
                +String(lat1)
                +","
                +String(lon1);
    }

    // TODO: CHECK THIS
    checkIfOpen(window){
        try {
            if(window.hostMarker) {

                let loc = this.openedWindowLocation;
                let wlatitude = window.hostMarker.latitude;
                let wlongitude = window.hostMarker.longitude;

                if(loc.latitude === wlatitude && loc.longitude === wlongitude){
                    return true;
                }
            }
            else {
                console.log("undefined")
                return false;
            }
        }
        catch (e){
            if(e instanceof TypeError){
                // console.log("typeError in checkIfOpen");
            }
        }

    }

    openInfoWindow(itemLocationObject: {latitude: number, longitude: number}){
        this.openedWindowLocation = itemLocationObject;
        this.mainMarkerOpen = false;
        // console.log(this.openedWindow)
    }

    // TODO: UNCOMMENT
    setZoom(distance: number){
        if(distance >= 0 && distance <= 150){
            this.zoom = 17;
        }
        else if(distance >= 151 && distance <= 300){
            this.zoom = 16;
        }
        else if(distance >= 301 && distance <= 700){
            this.zoom = 15;
        }
        else if(distance >= 701 && distance <= 1000){
            this.zoom = 14;
        }
        else {
            this.zoom = 16;
        }
    }

    infoWindowClose(window){
        try{
            if(window.hostMarker.latitude === this.openedWindowLocation.latitude && window.hostMarker.longitude === this.openedWindowLocation.longitude){
                this.openedWindowLocation = null;
            }
        }
        catch(e){
            if(e instanceof TypeError){
                // console.log("typeError in infoWindowClose")
            }
        }
    }

    setDistance(MdSliderChange){
        this.distance = MdSliderChange.value;
    }

    distanceToValue(){
        if(this.distance >= 0 && this.distance <= 333) {
            return "nagyon"
        }
        else if (this.distance >= 334 && this.distance <= 666) {
            return "közepesen"
        }
        else if(this.distance >= 667 && this.distance <= 1000) {
            return "kicsit"
        }
        else {
            return "undefined"
        }
    }

    openDropPinDialog(){
        this.mainMarkerText = "Itt sikerült pisilnem!";
        this.mainMarkerOpen = true;
        let dialogRef = this.dialog.open(SuccessDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;
        });
        this.openedWindowLocation = null;
        console.log(this.selectedOption);
    }

}
