import { Component, Input } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from '../services/userData.service';

declare let $;

@Component({
    selector: 'two-items-container',
    templateUrl: './two-items-container.component.html',
    styleUrls: ['./two-item-container.component.css']
})
export class TwoItemsContainer {

    @Input("itemArray") itemArray = [];
    @Input("category") category: any;

    public id: any;

    constructor(
        public databaseService: DatabaseService,
        public userDataService: UserDataService,
    ) {}

    acceptate() {
        $("#modalAcceptate").modal("show");
        this.databaseService.itemsAcceptate = this.itemArray;
    }

}