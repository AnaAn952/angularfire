import { Component, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from '../services/database.service';
import { UserDataService } from '../services/userData.service';
import { AngularFireStorage } from '@angular/fire/storage';

declare let $: any;

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
    public fileToUpload: any;

    constructor(
        public db: AngularFireDatabase,
        public databaseService: DatabaseService,
        public userDataService: UserDataService,
        public storage: AngularFireStorage,
    ) {
        let list = this.db.list('/events/');
        let a = list.valueChanges().subscribe((data: any) => {
            this.items = data.reverse();
            if (this.firstTime === true) {
                this.selectedItems = this.items;
                this.firstTime = false;
            }

            this.myItems.length = 0;
            this.goingItems.length = 0;

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
        console.log("my");
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

    public addEventOpen() {
        $('#modalAdaugaEveniment').modal('show');
    }

    public addPdf() {
        if (this.databaseService.removePdfBooksNumber === 0) {
            $('#modalPdf').modal('show');
        }
    }

    public uploadEventPhoto(event) {
        this.fileToUpload = event;
    }

    public submitEvent(title, data, ora, invitat, oras, adresa, telefon, detalii) {
        this.uploadEventPicture(this.fileToUpload, title, this.convertData(data), this.convertTime(ora), invitat, oras, adresa, telefon, detalii);
        $('#modalAdaugaEveniment').modal('hide');
    }

    public editEvent(title, data, ora, invitat, oras, adresa, telefon, detalii) {
        if (this.fileToUpload) {
            this.editExistingEvent(this.fileToUpload, title, this.convertData(data), this.convertTime(ora), invitat, oras, adresa, telefon, detalii);
        } else {
            this.databaseService.editEvent(null, title, this.convertData(data), this.convertTime(ora), invitat, oras, adresa, telefon, detalii);
        }
        $('#modalEditeazaEveniment').modal('hide');
    }

    uploadEventPicture(event, title, data, ora, invitat, oras, adresa, telefon, detalii) {
        const randomId = Math.random().toString(36).substring(2);
        let ref = this.storage.ref(randomId);
        let task = ref.put(event.target.files[0]).then((result) => {
            ref.getDownloadURL().subscribe((obj: any) => {
                let downloadUrl = obj;
                this.databaseService.addNewEvent(downloadUrl, title, data, ora, invitat, oras, adresa, telefon, detalii);
            });
        })
    }

    editExistingEvent(event, title, data, ora, invitat, oras, adresa, telefon, detalii) {
        const randomId = Math.random().toString(36).substring(2);
        let ref = this.storage.ref(randomId);
        let task = ref.put(event.target.files[0]).then((result) => {
            ref.getDownloadURL().subscribe((obj: any) => {
                let downloadUrl = obj;
                this.databaseService.editEvent(downloadUrl, title, data, ora, invitat, oras, adresa, telefon, detalii);
            });
        })
    }

    public convertTime(time: string): any[] {
        let cleanTime = time.split(" ").join("");
        return cleanTime.split("-");
    }

    public convertData(date:string): any {
        let [an, luna, zi] = date.split("-");
        return zi + '.' + luna + '.' + an;
     }

     public convertToInputDate(date: string): any {
        if (date) {
            let [zi, luna, an] = date.split(".");
            return an + '-' + luna + '-' + zi;
        } else {
            return '';
        }
     }
}