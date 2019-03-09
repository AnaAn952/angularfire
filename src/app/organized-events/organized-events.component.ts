import { Component, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from '../services/database.service';

@Component({
    selector: 'organized-events-item',
    templateUrl: './organized-events.component.html',
    styleUrls: ['./organized-events.component.css'],
})
export class OrganizedEventsComponent {

    @ViewChild("all") all: any;
    @ViewChild("my") my: any;
    @ViewChild("going") going: any;

    public myItems = [];
    public goingItems = [];
    public selectedItems = [];
    public firstTime = true;

    constructor(
        public db: AngularFireDatabase,
        public databaseService: DatabaseService,
    ) {
        let list = this.db.list('/events/');
        let a = list.valueChanges().subscribe((data: any) => {
            this.items = data.reverse();
            if (this.firstTime === true) {
                this.selectedItems = this.items;
                this.firstTime = false;
            }

            this.myItems = [];
            this.goingItems = [];

            for (let item of this.items) {
                if (item.organizator === this.databaseService.userData.userData.email) {
                    this.myItems.push(item);
                }
                if (item.participanti[this.databaseService.convertToDatabaseFormat(this.databaseService.userData.userData.email)] &&
                    item.participanti[this.databaseService.convertToDatabaseFormat(this.databaseService.userData.userData.email)] === "going") {
                    this.goingItems.push(item);
                }
            }
        })
    }

    public items: any[] = [];

    allEvents() {
        this.changeColor("all");
        this.selectedItems = this.items;
    }

    myEvents() {
        this.changeColor("my");
        this.selectedItems = this.myItems;
    }

    goingEvents() {
        this.changeColor("going");
        this.selectedItems = this.goingItems;
    }

    changeColor(item: string) {
        switch (item) {
            case "all":
                this.all.nativeElement.classList.add("selected");
                this.my.nativeElement.classList = ["custom-div"];
                this.going.nativeElement.classList = ["custom-div"];
                break;
            case "my":
                this.all.nativeElement.classList = ["custom-div"];
                this.my.nativeElement.classList.add("selected");
                this.going.nativeElement.classList = ["custom-div"];
                break;
            case "going":
                this.all.nativeElement.classList = ["custom-div"];
                this.my.nativeElement.classList = ["custom-div"];
                this.going.nativeElement.classList.add("selected");
        }
    }
}