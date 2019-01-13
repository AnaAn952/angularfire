import { Component, Input } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
    selector: 'catalogue-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent {
    @Input('item') item: any;
    @Input('zona_de_raspuns') zona_de_raspuns: any = false;
    @Input('pe_asta') pe_asta: any = false;
    @Input('allowedActiune') allowedActiune: any = true;

    public dbBooks: any;

    constructor(
        public databaseService: DatabaseService,
        private db: AngularFireDatabase,
    ) {
        this.dbBooks = db.list('/cartile');
    }

    public tradeBook() {
        console.log('clicked', this.item);

        this.databaseService.addChosenBook(this.item);
    }

    public isNotMine() {
        return !(this.item.id.split('.com_')[0] + '.com' === localStorage.email);
    }

    public selectat() {
        this.databaseService.elementSelectatDinPropuneri = this.item;

        let x = this.dbBooks.valueChanges().subscribe((items: any) => {
            let u = items.filter((book) => {
                return book.id.split('.com_')[0] + '.com' === this.item.trader;
            });

            this.databaseService.thatPersonsBooks = u;

            if (u.length) {
                x.unsubscribe();
            }
        });
    }
}