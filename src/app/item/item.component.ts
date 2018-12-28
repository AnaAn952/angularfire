import { Component, Input } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
    selector: 'catalogue-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent {
    @Input('item') item: any;

    constructor(
        public databaseService: DatabaseService
    ) {}

    public tradeBook() {
        console.log('clicked', this.item);

        this.databaseService.addChosenBook(this.item);
    }

    public isNotMine() {
        return !(this.item.id.split('.com_')[0] + '.com' === localStorage.email);
    }
}