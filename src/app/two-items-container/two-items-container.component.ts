import { Component, Input } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
    selector: 'two-items-container',
    templateUrl: './two-items-container.component.html',
    styleUrls: ['./two-item-container.component.css']
})
export class TwoItemsContainer {

    @Input("itemArray") itemArray = [];

    public dbBooks: any;

    constructor(
        public databaseService: DatabaseService,
        private db: AngularFireDatabase,
    ) {
        this.dbBooks = db.list('/cartile');
    }

}