import { Component, Input, OnInit } from '@angular/core';
import { FetchBooksService } from '../services/fetch-books.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';

@Component({
    selector: 'app-book-c',
    templateUrl: './books-catalogue.component.html',
    styleUrls: ['./books-catalogue.component.css']
})
export class BooksCatalogueComponent implements OnInit {

    public items: any = [];
    public dbRef: any;
    public myBooks: any = [];

    constructor(
        public fetchBooksService: FetchBooksService,
        private db: AngularFireDatabase,
        private userDataService: UserDataService,
        public databaseService: DatabaseService,
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

    ngOnInit() {
        this.dbRef.valueChanges().subscribe((items: any) => {
            for (let item of items) {
                let found = false;
                if (item.titlu.indexOf("") >= 0) {
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

        let x = this.dbRef.valueChanges().subscribe((items: any) => {
            this.myBooks = items.filter((book) => {
                return book.id.split('.com_')[0] + '.com' === this.userDataService.userData.email;
            });

            if (this.myBooks) {
                x.unsubscribe();
            }
        });
    }
}