import { Component, Input, ViewChild } from '@angular/core';
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
    @Input('allowedActiune') allowedActiune: any = false;
    @Input('alege_catalog') alege_catalog: any = false;

    @ViewChild('itemDiv') itemDiv: any;

    public dbBooks: any;
    public showDeselect: any = false;

    constructor(
        public databaseService: DatabaseService,
        private db: AngularFireDatabase,
    ) {
        this.dbBooks = db.list('/cartile');
    }

    public tradeBook() {
        this.databaseService.itemForNewTrade = this.item;
    }

    public chooseBookTrade() {
        this.showDeselect = true;
        this.databaseService.chosenBookTrade += this.item.id + ",";
    }

    public anuleazaAlegerea() {
        this.showDeselect = false;
        let books = this.databaseService.chosenBookTrade;

        this.databaseService.chosenBookTrade = books.split(this.item.id + ',')[0] + books.split(this.item.id + ',')[1];
    }

    public acceptaAceastaCarte() {
        this.databaseService.adaugaLaSchimburiAcceptate(this.item);
    }

    public isNotMine() {
        return !(this.item.id.split('.com_')[0] + '.com' === localStorage.email);
    }
}