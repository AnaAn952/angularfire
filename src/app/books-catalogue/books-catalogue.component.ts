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
    public bookNumber: number = 0;
    public page = 1;
    public pageNumbers = [];
    public filters = {
        title: '',
        writer: '',
        languages: [],
        category: [],
    };

    constructor(
        public eventsService: EventsService,
        private db: AngularFireDatabase,
        private userDataService: UserDataService,
        public databaseService: DatabaseService,
    ) {
        this.dbRef = db.list("/cartile");

        eventsService.searchField.subscribe((data: any) => {
            this.filters.title = data;
            this.exposeAllBooks(this.filters);
        });
    }

    ngOnInit() {
        this.exposeAllBooks("");
        this.getMyBooks();

        $("#filters").on("submit", (e) => {
            this.filters.title = '';
            this.filters.writer = '';
            this.filters.category.length = 0;
            this.filters.languages.length = 0;
            this.setFilters(e.target);
        });
    }

    public setFilters(form) {
        if (form[0].value) {
            this.filters.title = form[0].value;
        }
        if (form[1].value) {
            this.filters.writer = form[1].value;
        }
        for (let i=2; i<=4; i++) {
            if (form[i].checked) {
                this.filters.languages.push(form[i].value);
            }
        }
        for (let i=5; i<=13; i++) {
            if (form[i].checked) {
                this.filters.category.push(form[i].value);
            }
        }
        this.exposeAllBooks(this.filters);
    }

    public exposeAllBooks(search: any) {
        this.items = [];
        let item = JSON.stringify(this.items);
        this.dbRef.valueChanges().subscribe((items: any) => {
            this.items = [];
            for (let item of items) {
                if (this.filtersOk(item)) {
                    console.log(item.titlu);
                    if(item.status == "disponibila") {
                        this.items.push(item);
                    }
                }
            }
            console.log(this.items);
            this.bookNumber = this.items.length;
            this.pageNumbers = [];
            for (let i=1; i<=Math.ceil(this.bookNumber/8); i++) {
                this.pageNumbers.push(i);
            }
        });
    }

    public filtersOk(item: any) {
        if (this.filters.title && item.titlu.toLowerCase().indexOf(this.filters.title.toLowerCase()) < 0) {
            return false;
        }
        if (this.filters.writer && item.autor.toLowerCase().indexOf(this.filters.title.toLowerCase()) < 0) {
            return false;
        }
        if (this.filters.languages.length && this.filters.languages.indexOf(item.limba) < 0 && this.filters.languages.indexOf("altele") < 0) {
            return false;
        }
        if (this.filters.category.length && this.filters.category.indexOf(item.gen) < 0 && this.filters.category.indexOf("altele") < 0) {
            return false;
        }
        return true;
    }

    public getMyBooks() {
        this.dbRef.valueChanges().subscribe((items: any) => {
            this.myBooks = [];
            this.myBooks = items.filter((book) => {
                return book.proprietarCurent == localStorage.getItem("email");
            });
            console.log("myBooksAre", localStorage.getItem("email"), this.myBooks);
            this.myAvailableBooks = items.filter((book) => {
                return book.proprietarCurent === localStorage.getItem("email") && book.status !== "indisponibil";
            });
        });
    }

    setPage(page: number) {
        this.page = page;
        $(".pagination > .active").removeClass("active");
        $(".pagination > .page-item:nth-child(" + (this.page + 1) + ")").addClass("active");
    }

    goLeft() {
        if (this.page > 1) {
            this.page--;
            $(".pagination > .active").removeClass("active");
            $(".pagination > .page-item:nth-child(" + (this.page + 1) + ")").addClass("active");
        }
    }

    goRight() {
        if (this.page < this.pageNumbers.length) {
            this.page ++;
            $(".pagination > .active").removeClass("active");
            $(".pagination > .page-item:nth-child(" + (this.page + 1) + ")").addClass("active");
        }
    }

    public showItemsOnThePage(items) {
        let shownItems = items.slice((this.page-1)*8, (this.page-1)*8+8);
        return shownItems;
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