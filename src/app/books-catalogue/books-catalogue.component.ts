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
            this.exposeAllBooks(data);
        });
    }

    ngOnInit() {
        this.exposeAllBooks("");
        this.getMyBooks();
    }

    public exposeAllBooks(search: string) {
        let a = this.dbRef.valueChanges().subscribe((items: any) => {
            for (let item of items) {
                let found = false;
                if (item.titlu.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                    console.log(item.titlu, search);
                    for(let i of this.items) {
                        if (i.titlu == item.titlu)
                            found = true;
                    }
                    if(found == false) {
                        this.items.push(item);
                    }
                }
            }

            if (items) a.unsubscribe();
        });
    }

    public getMyBooks() {
        let x = this.dbRef.valueChanges().subscribe((items: any) => {
            this.myBooks = items.filter((book) => {
                return book.id.split('.com_')[0] + '.com' === this.userDataService.userData.email;
            });

            if (this.myBooks) {
                x.unsubscribe();
            }
        });
    }

    public tradeBook() {
        this.databaseService.itemForNewTrade = this.databaseService.itemModalDetalii;
    }
}