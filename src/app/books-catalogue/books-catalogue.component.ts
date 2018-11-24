import { Component, Input, OnInit } from '@angular/core';
import { FetchBooksService } from '../services/fetch-books.service';

@Component({
    selector: 'app-book-c',
    templateUrl: './books-catalogue.component.html',
    styleUrls: ['./books-catalogue.component.css']
})
export class BooksCatalogueComponent {

    public items: any = [];

    constructor(
        public fetchBooksService: FetchBooksService
    ) {
        fetchBooksService.data.subscribe((data: any) => {
            this.items = fetchBooksService.getBooks(data);
        })
    }

}