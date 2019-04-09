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
    ) {
        this.id = Math.floor(Math.random() * 1000);
    }

    acceptate() {
        $("#modalAcceptate" + this.id).modal("show");
        document.getElementById("acceptate" + this.id).addEventListener("submit", (e) => {
                let cartePrimitaId;
                if (this.itemArray[1].proprietarCurent !== this.userDataService.userData.email) {
                    cartePrimitaId = this.itemArray[1].id;
                } else {
                    cartePrimitaId = this.itemArray[0].id;
                }
                if (e.target[0].value === "da") {
                    this.databaseService.setBookQuality(cartePrimitaId, e.target[1].value);
                    // this.databaseService.rating(e.target[2].value, this.itemArray[1].proprietarCurent);
                } else {
                    this.databaseService.raporteaza(e.target[1].value, e.target[2].value, cartePrimitaId);
                }
                $("#modalAcceptate" + this.id).modal("hide");
        });
    }

}