import { Component, Input, OnInit } from '@angular/core';
import { EventsService } from '../services/fetch-books.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';

@Component({
    selector: 'app-book-tracking',
    templateUrl: './book-tracking.component.html',
    styleUrls: ['./book-tracking.component.css']
})
export class BookTrackingComponent implements OnInit {

    @Input('items') items: any = [];

    constructor(
        public databaseService: DatabaseService,
    ) {
        setTimeout(() => {
            console.log(this.items);
        }, 5000);
    }

    ngOnInit() {}
}