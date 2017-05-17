// import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
//
// @Injectable()
// export class DistanceService {
//
//     constructor(private http: Http){}
//
//     getDistance(){
//         const headers = new Headers({'access-Control-Allow-Origin': '*'});
//         return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyA8rAZslIIpPxRswiU9as5k93kpGOQfXAw')
//                         .map(this.extractData);
//     }
//
//     private extractData(res: Response){
//         let body = res.json();
//         console.log(body);
//         return body.data || { };
//     }
// }
