import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import "rxjs/add/operator/map";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    list: FirebaseListObservable<any[]>;
    title: string = 'pisilnikell';
    location = <Coordinates>{};
    lat: number = 47;
    lng: number = 19;
    distance: number = 450;
    zoom: number = 15;

    constructor(private db: AngularFireDatabase){
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

}
