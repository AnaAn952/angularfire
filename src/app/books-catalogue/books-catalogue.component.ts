import { Component, Input, OnInit } from '@angular/core';
import { FetchBooksService } from '../services/fetch-books.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
    selector: 'app-book-c',
    templateUrl: './books-catalogue.component.html',
    styleUrls: ['./books-catalogue.component.css']
})
export class BooksCatalogueComponent {

    public items: any = [];
    public dbRef: any;

    constructor(
        public fetchBooksService: FetchBooksService,
        private db: AngularFireDatabase
    ) {
        this.dbRef = db.list("/cartile");

        fetchBooksService.data.subscribe((data: any) => {
            this.items = [];

            this.dbRef.valueChanges().subscribe((items: any) => {
                for (let item of items) {
                    let found = false;
                    if (item.titlu.indexOf(data) >= 0) {
                        for(let i of this.items) {
                            if (i.titlu == item.titlu)
                                found = true;
                        }
                        if(found == false) {
                            this.items.push(item);
                        }
                    }
                }
            });
        })
    }

}