import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { TranslateService } from '../services/translate.service';

declare let $: any;

@Component({
    selector: 'app-book-tracking',
    templateUrl: './book-tracking.component.html',
    styleUrls: ['./book-tracking.component.css']
})
export class BookTrackingComponent implements OnInit {

    currentItem: any = {};

    @Input('items') items: any = [];

    constructor(
        public databaseService: DatabaseService,
        public translate: TranslateService,
    ) {
        $("#modalTracking").on("hide.bs.modal", () => {
           console.log("hidden");
        });
    }

    ngOnInit() {}

    openDetails(item) {
        this.currentItem = item;
        $("#modalTracking").modal("show");
        console.log(this.currentItem);
    }
}