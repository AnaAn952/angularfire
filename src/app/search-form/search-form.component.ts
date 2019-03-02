import { Component, ViewChild } from '@angular/core';
import { EventsService } from '../services/fetch-books.service';
import { Router } from '@angular/router';

@Component({
    selector: 'search-form',
    template: `
        <form>
            <input #inputsearch id="input-search" #input class="form-control col-xs-6" style='display: inline !important; width: 500px !important;' type="text" placeholder="Caută" aria-label="Search">
            <button type="submit" class="btn btn-primary" style="display: none;" (click)="method(input.value)"> Caută </button>
        </form>
    `,
    styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent {

    @ViewChild("inputsearch") input: any;

    constructor(
        public eventsService: EventsService,
        public router: Router,
    ) {}

    method(value: any) {
        if (window.location.href.indexOf('books') < 0) {
            this.router.navigate(['/books']);
            setTimeout(() => {
                this.eventsService.searchField.emit(value);
            });
        } else {
            this.eventsService.searchField.emit(value);
        }

        this.input.nativeElement.value = "";
    }

}