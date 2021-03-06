import { Component, OnInit, Output } from '@angular/core';
import { MdDialogRef } from '@angular/material';


@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<SuccessDialogComponent>) {}

  ngOnInit() {
  }

    peeSuccess(text){
        console.log(text.value);
    }

}
