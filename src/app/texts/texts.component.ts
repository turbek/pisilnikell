import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

// import { DistanceService } from './texts.distance.service';

@Component({
  selector: 'app-texts',
  // providers: [DistanceService],
  templateUrl: './texts.component.html',
  styleUrls: ['./texts.component.css']
})
export class TextsComponent implements OnInit {
    @Input() location;
    @Input() list: FirebaseListObservable<any[]>;
    @Output() upvoteCreated = new EventEmitter<{upvote: number, key: string}>();
    @Output() itemDeleted = new EventEmitter<{key: string}>();

    // constructor(private distanceService: DistanceService) { }
    constructor() { }

    ngOnInit() {
    }

    upvote(upvote, key) {
        this.upvoteCreated.emit({upvote, key});
    }

    delete(key) {
        this.itemDeleted.emit({key});
    }

    // onGet() {
    //     this.distanceService.getDistance()
    //         .subscribe(
    //             (response) => console.log(response),
    //             (error) => console.log(error)
    //         );
    // }
    //
    // filterForDistance(location) {
    //     this.onGet();
    //     return true;
    // }

}
