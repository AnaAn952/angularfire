import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { EventsService } from '../services/fetch-books.service';
import { TranslateService } from '../services/translate.service';
declare let $:any;

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
    public confirmate_de_mine: any[] = [];
    public raportate: any[] = [];
    public finalizate: any[] = [];
    public recomandate: any[] = [];
    public fileToUpload: any = null;
    public profilePhotoToUpload: any = null;
    public _selectCategorie: string = "selectChosen";

    constructor(
        public userDataService: UserDataService,
        public storage: AngularFireStorage,
        public databaseService: DatabaseService,
        public eventService: EventsService,
        public translate: TranslateService,
    ) {}

    ngOnInit() {
        this.getData();
        this.getRecomandate();
        this.eventService.resetMyBooks.subscribe(() => {
           this.getMyBooks();
        });
        this.eventService.resetChosenByMe.subscribe(() => {
           this.getChosenByMe();
        });
        this.eventService.resetSolicitate.subscribe(() => {
            this.getSolicitate();
        });
        this.eventService.resetAcceptate.subscribe(() => {
           this.getAcceptate();
        });
        this.eventService.resetConfirmate.subscribe(() => {
            this.getConfirmateDeMine();
        });
        this.eventService.resetFinalizate.subscribe(() => {
           this.getFinalizate();
        });
        this.eventService.resetRaportate.subscribe(() => {
           this.getRaportate();
        });
        this.eventService.resetAll.subscribe(() => {
           this.getData();
        });
        this.eventService.resetRecomandate.subscribe(() => {
            this.getRecomandate();
        })
    }

    public getChosenByMe() {
        let itemInfoChosenByMe = [];
        this.chosenByMe = [];

        for (let item in this.userDataService.userData.chosenByMe) {
            itemInfoChosenByMe.push(this.userDataService.userData.chosenByMe[item]);
        }

        let chosenByMeIds = Object.keys(this.userDataService.userData.chosenByMe);
        this.databaseService.setBooksArray(chosenByMeIds, this.chosenByMe, ["oferi_schimb"], itemInfoChosenByMe);
    }

    public getSolicitate() {
        let itemInfoSolicitate = [];
        this.solicitate = [];

        for (let item in this.userDataService.userData.solicitate) {
            itemInfoSolicitate.push(this.userDataService.userData.solicitate[item]);
        }

        this.databaseService.setBooksArray(itemInfoSolicitate.map(item => item.id.split(".").join("!")), this.solicitate, ['zona_de_raspuns'], itemInfoSolicitate);
        this.databaseService.setBooksArray(itemInfoSolicitate.map(item => item.id.split(".").join("!")), this.databaseService.solicitate, ['zona_de_raspuns'], itemInfoSolicitate);
    }

    public getMyBooks() {
        this.myBooks = [];

        this.databaseService.setBooksArray(this.userDataService.userData.idurileCartilorMele, this.myBooks, ['myBooks']);
    }

    public getAcceptate() {
        let acceptateIds: any = Object.keys(this.userDataService.userData.acceptate);
        this.acceptate = [];

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

    public getConfirmateDeMine() {
        let confirmateIds: any = Object.keys(this.userDataService.userData.confirmate_de_mine);
        this.confirmate_de_mine = [];

        for (let index in confirmateIds) {
            confirmateIds[index] = confirmateIds[index].split("__");
        }

        for (let i = 0; i< confirmateIds.length; i++) {
            this.confirmate_de_mine[i] = [];
        }

        for (let i in confirmateIds) {
            this.databaseService.setBooksArray(confirmateIds[i], this.confirmate_de_mine[i], []);
        }
    }

    public getFinalizate() {
        let finalizateIds: any = Object.keys(this.userDataService.userData.finalizate);
        this.finalizate = [];

        for (let index in finalizateIds) {
            finalizateIds[index] = finalizateIds[index].split("__");
        }

        for (let i = 0; i< finalizateIds.length; i++) {
            this.finalizate[i] = [];
        }

        for (let i in finalizateIds) {
            this.databaseService.setBooksArray(finalizateIds[i], this.finalizate[i], []);
        }
    }

    public getRaportate() {
        let raportateIds: any = Object.keys(this.userDataService.userData.raportate);
        this.raportate = [];

        for (let index in raportateIds) {
            raportateIds[index] = raportateIds[index].split("__");
        }

        for (let i = 0; i< raportateIds.length; i++) {
            this.raportate[i] = [];
        }

        for (let i in raportateIds) {
            this.databaseService.setBooksArray(raportateIds[i], this.raportate[i], []);
        }
    }

    public getRecomandate() {
        let recomandateIds = this.userDataService.recommendedBooksIds;
        this.recomandate = [];

        this.databaseService.setBooksArray(recomandateIds, this.recomandate, []);
        setTimeout(() => {
            console.log(recomandateIds, this.recomandate);
        }, 3000);
    }

    public addBookOpen() {
        $('#modalAdaugaCarte').modal('show');
    }

    public submitBook(title, gen, limba, stare, autor) {
        this.uploadBookPicture(this.fileToUpload, title, gen, limba, stare, autor);
        $('#modalAdaugaCarte').modal('hide');
    }

    public editMyBook(title, gen, limba, stare, autor) {
        if (this.fileToUpload) {
            this.editBookPicture(this.fileToUpload, title, gen, limba, stare, autor);
        } else {
            this.databaseService.editExistingBook(null, title, gen, limba, stare, autor);
        }
        $('#modalEditeazaCarte').modal('hide');
    }

    public editeazaInformatii() {
        $('#modalInfo').modal('show');
    }

    public getData() {
        this.getChosenByMe();
        this.getSolicitate();
        this.getMyBooks();
        this.getAcceptate();
        this.getConfirmateDeMine();
        this.getRaportate();
        this.getFinalizate();
    }

    public changeInfo(name: string, phone: string, age: string, town: string, ocupation: string, language: string) {
        let info = {};
        if (name !== undefined) {
            info["username"] = name;
            this.userDataService.userData.username = name;
        }
        if (phone !== undefined) {
            info["telefon"] = phone;
            this.userDataService.userData.telefon = phone;
        }
        if (age !== undefined) {
            info["varsta"] = age;
            this.userDataService.userData.varsta = age;
        }
        if (town !== undefined) {
            info["oras"] = town;
            this.userDataService.userData.oras = town;
        }
        if (ocupation !== undefined) {
            info["ocupatie"] = ocupation;
            this.userDataService.userData.ocupatie = ocupation;
        }
        if (language !== undefined) {
            info["limba"] = language;
            this.userDataService.userData.limba = language;
        }

        $("#modalInfo").modal("hide");
        this.databaseService.changeInformation(info);
    }

    public available(book: any) {
        return book.status !== "indisponibil";
    }

    public uploadPoza(event) {
        this.fileToUpload = event;
    }

    uploadBookPicture(event, title, gen, limba, stare, autor) {
        const randomId = Math.random().toString(36).substring(2);
        let ref = this.storage.ref(randomId);
        let task = ref.put(event.target.files[0]).then((result) => {
            ref.getDownloadURL().subscribe((obj: any) => {
               let downloadUrl = obj;
               this.databaseService.addNewBook(downloadUrl, title, gen, limba, stare, autor);
            });
        })
    }

    editBookPicture(event, title, gen, limba, stare, autor) {
        const randomId = Math.random().toString(36).substring(2);
        let ref = this.storage.ref(randomId);
        let task = ref.put(event.target.files[0]).then((result) => {
            ref.getDownloadURL().subscribe((obj: any) => {
                let downloadUrl = obj;
                this.databaseService.editExistingBook(downloadUrl, title, gen, limba, stare, autor);
            });
        });
    }

    public modalPozaProfil() {
        $('#modalprofil').modal("show");
    }

    public uploadProfilePhoto(event) {
        this.profilePhotoToUpload = event;
    }

    selectCategorie(value) {
        console.log(value);
        if (value === "1") {
            this._selectCategorie = "selectConfirmate";
            return;
        }
        if (value === "4") {
            this._selectCategorie = "selectChosen";
            return;
        }
        if (value === "5") {
            this._selectCategorie = "selectSolicitate";
            return;
        }
        if (value === "6") {
            this._selectCategorie = "selectAcceptate";
            return;
        }
        if (value == "2") {
            this._selectCategorie = "selectFinalizate";
        } else {
            this._selectCategorie = "selectRaportate";
        }
    }

    submitPhoto() {
        this.uploadPicture(this.profilePhotoToUpload);
        $('#modalprofil').modal("hide");
    }


    uploadPicture(event) {
        const randomId = Math.random().toString(36).substring(2);
        let ref = this.storage.ref(randomId);
        let task = ref.put(event.target.files[0]).then((result) => {
            ref.getDownloadURL().subscribe((obj: any) => {
                let downloadUrl = obj;
                this.databaseService.updateProfilePicture(downloadUrl);
                this.userDataService.userData.profilePicture = downloadUrl;
            });
        })
    }

    public tradeBook() {
        this.databaseService.itemForNewTrade = this.databaseService.itemModalDetalii;
    }
}