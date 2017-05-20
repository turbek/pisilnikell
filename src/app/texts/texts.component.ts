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
    @Output() upvoteDeleted = new EventEmitter<{upvote: number, key: string}>();
    @Output() itemDeleted = new EventEmitter<{key: string}>();
    isActiveList = [];

    constructor() { }

    ngOnInit() {
    }

    upvote(upvote, key) {
        this.upvoteCreated.emit({upvote, key});
    }

    delete(key) {
        this.itemDeleted.emit({key});
    }

    upvoteButtonClicked(upvote, key) {
        if(this.isActive(key)){
            let index = this.isActiveList.indexOf(key);
            this.isActiveList.splice(index, 1);
            this.upvoteDeleted.emit({upvote, key});
        }
        else {
            this.isActiveList.push(key);
        }
    }

    isActive(key) {
        for(let entry of this.isActiveList){
            if(entry === key){
                return true;
            }
        }
        return false;
    }

    textClicked() {
        console.log(123);
    }

}
