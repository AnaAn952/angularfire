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
    public
    someItems: any = [];
    public bookNumber: number = 0;
    public page = 1;
    public pageNumbers = [];
    public filters = {
        title: '',
        writer: '',
        language: '',
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
            this.filters.language = '';
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
        if (form[2].value) {
            this.filters.language = form[2].value;
        }
        for (let i=3; i<=12; i++) {
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
                    if(item.status == "disponibila") {
                        this.items.push(item);
                    }
                }
            }
            this.bookNumber = this.items.length;
            this.pageNumbers = [];
            for (let i=1; i<=Math.ceil(this.bookNumber/8); i++) {
                this.pageNumbers.push(i);
            }
            if (this.pageNumbers.length) {
                console.log(this.pageNumbers);
                setTimeout(() => {
                    this.setPage(1);
                }, 500);
            }
        });
    }

    public filtersOk(item: any) {
        if (this.filters.title && item.titlu.toLowerCase().indexOf(this.filters.title.toLowerCase()) < 0) {
            return false;
        }
        if (this.filters.writer && item.autor.toLowerCase().indexOf(this.filters.writer.toLowerCase()) < 0) {
            return false;
        }
        if (this.filters.language && item.limba.toLowerCase().indexOf(this.filters.language.toLowerCase()) < 0) {
            return false;
        }
        if (this.filters.category.length && this.filters.category.indexOf(item.gen) < 0) {
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
        this.someItems = [];
        let ids = Object.values(this.databaseService.itemModalDetalii.istorie).map((item: any) => {
            return this.databaseService.convertToDatabaseFormat(item.proprietar);
        });
        let dates = Object.values(this.databaseService.itemModalDetalii.istorie).map((item: any) => {
            return {"date_owned": item.data};
        });
        this.databaseService.setPersonsArray(ids, this.someItems, dates);
        setTimeout(() => {
            console.log(this.someItems);
        }, 4000);
    }

    public tradeBook() {
        this.databaseService.itemForNewTrade = this.databaseService.itemModalDetalii;
    }
}