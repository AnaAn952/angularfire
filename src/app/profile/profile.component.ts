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
    public acceptate: any[] = [];

    constructor(
        public userDataService: UserDataService,
        public databaseService: DatabaseService,
    ) {}

    ngOnInit() {

        this.getChosenByMe();
        this.getSolicitate();
        this.getMyBooks();
        this.getAcceptate();

        setTimeout(() => {
            console.log("ch", this.chosenByMe);
            console.log("so", this.solicitate);
            console.log("my", this.myBooks);
            console.log("ac", this.acceptate);
        }, 4000);
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

    public getAcceptate() {
        let acceptateIds: any = Object.keys(this.userDataService.userData.acceptate);

        for (let index in acceptateIds) {
            acceptateIds[index] = acceptateIds[index].split("__");
        }

        for (let i = 0; i< acceptateIds.length; i++) {
            this.acceptate[i] = [];
        }

        for (let i in acceptateIds) {
            this.databaseService.setBooksArray(acceptateIds[i], this.acceptate[i], []);
        }
    }
}