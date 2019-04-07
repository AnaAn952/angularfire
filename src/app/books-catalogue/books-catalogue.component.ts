import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/fetch-books.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';

declare let $: any;

@Component({
    selector: 'app-book-c',
    templateUrl: './books-catalogue.component.html',
    styleUrls: ['./books-catalogue.component.css']
})
export class BooksCatalogueComponent implements OnInit {

    public items: any = [];
    public dbRef: any;
    public myBooks: any = [];
    public myAvailableBooks: any = [];
    public someItems: any = [];

    constructor(
        public eventsService: EventsService,
        private db: AngularFireDatabase,
        private userDataService: UserDataService,
        public databaseService: DatabaseService,
    ) {
        this.dbRef = db.list("/cartile");

        eventsService.searchField.subscribe((data: any) => {
            this.items = [];
            this.exposeAllBooks(data);
        });
    }

    ngOnInit() {
        this.exposeAllBooks("");
        this.getMyBooks();
    }

    public exposeAllBooks(search: string) {
        let item = JSON.stringify(this.items);
        this.dbRef.valueChanges().subscribe((items: any) => {
            this.items = [];
            for (let item of items) {
                let found = false;
                if (item.titlu.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                    for(let i of this.items) {
                        if (i.titlu == item.titlu)
                            found = true;
                    }
                    if(found == false && item.status == "disponibila") {
                        this.items.push(item);
                    }
                }
            }
        });
    }

    public getMyBooks() {
        this.dbRef.valueChanges().subscribe((items: any) => {
            this.myBooks = [];
            this.myBooks = items.filter((book) => {
                return book.proprietarCurent == this.userDataService.userData.email;
            });
            this.myAvailableBooks = items.filter((book) => {
                return book.proprietarCurent === this.userDataService.userData.email && book.status !== "indisponibil";
            });
        });
    }

    public tradeBook() {
        this.databaseService.itemForNewTrade = this.databaseService.itemModalDetalii;
    }

    public openAici() {
        this.getItems();
        $("#tracking").modal("show");
    }

    public getItems() {
        console.log("some", this.someItems);
        this.someItems = [];
        let ids = Object.values(this.databaseService.itemModalDetalii.istorie).map((item: any) => {
            return this.databaseService.convertToDatabaseFormat(item.proprietar);
        });
        let dates = Object.values(this.databaseService.itemModalDetalii.istorie).map((item: any) => {
            return {"date_owned": item.data};
        });
        console.log(ids);
        this.databaseService.setPersonsArray(ids, this.someItems, dates);
    }
}