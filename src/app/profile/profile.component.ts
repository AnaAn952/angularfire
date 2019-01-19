import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

    public myBooks: any[] = [];
    public chosenByMe: any[] = [];
    public solicitate: any[] = [];

    constructor(
        public userDataService: UserDataService,
        public databaseService: DatabaseService,
    ) {}

    ngOnInit() {
        this.getChosenByMe();
        this.getSolicitate();
        this.getMyBooks();
    }

    public getChosenByMe() {
        let chosenByMeIds = Object.keys(this.userDataService.userData.chosenByMe);
        this.databaseService.setBooksArray(chosenByMeIds, this.chosenByMe, ["oferi_schimb"]);
    }

    public getSolicitate() {
        let itemInfoSolicitate = [];

        for (let item in this.userDataService.userData.solicitate) {
            itemInfoSolicitate.push(this.userDataService.userData.solicitate[item]);
        }

        this.databaseService.setBooksArray(itemInfoSolicitate.map(item => item.id.split(".").join("!")), this.solicitate, [], itemInfoSolicitate);
    }

    public getMyBooks() {
        let myBooksIds = [];

        for(let i = 1; i<= this.userDataService.userData.bookNumber; i++) {
            myBooksIds.push(this.userDataService.userData.email.split(".").join("!") + "_" + i);
        }

        this.databaseService.setBooksArray(myBooksIds, this.myBooks, []);
    }
}