import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { EventsService } from '../services/fetch-books.service';
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
    public fileToUpload: any = null;
    public profilePhotoToUpload: any = null;

    constructor(
        public userDataService: UserDataService,
        public storage: AngularFireStorage,
        public databaseService: DatabaseService,
        public eventService: EventsService,
    ) {}

    ngOnInit() {

        console.log("changes - 1", this.userDataService.userData.solicitate);
        this.getData();
        this.eventService.resetProfileData.subscribe(() => {
            console.log("changes", this.userDataService.userData.solicitate);
           this.getData();
        });

        // setTimeout(() => {
        //     console.log("ch", this.chosenByMe);
        //     console.log("so", this.solicitate);
        //     console.log("my", this.myBooks);
        //     console.log("ac", this.finalizate);
        // }, 4000);
    }

    public getChosenByMe() {
        let itemInfoChosenByMe = [];

        for (let item in this.userDataService.userData.chosenByMe) {
            itemInfoChosenByMe.push(this.userDataService.userData.chosenByMe[item]);
        }

        let chosenByMeIds = Object.keys(this.userDataService.userData.chosenByMe);
        this.databaseService.setBooksArray(chosenByMeIds, this.chosenByMe, ["oferi_schimb"], itemInfoChosenByMe);
    }

    public getSolicitate() {
        let itemInfoSolicitate = [];

        for (let item in this.userDataService.userData.solicitate) {
            itemInfoSolicitate.push(this.userDataService.userData.solicitate[item]);
        }

        this.databaseService.setBooksArray(itemInfoSolicitate.map(item => item.id.split(".").join("!")), this.solicitate, ['zona_de_raspuns'], itemInfoSolicitate);
        this.databaseService.setBooksArray(itemInfoSolicitate.map(item => item.id.split(".").join("!")), this.databaseService.solicitate, ['zona_de_raspuns'], itemInfoSolicitate);
    }

    public getMyBooks() {
        this.databaseService.setBooksArray(this.userDataService.userData.idurileCartilorMele, this.myBooks, ['myBooks']);
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

    public getConfirmateDeMine() {
        let confirmateIds: any = Object.keys(this.userDataService.userData.confirmate_de_mine);

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

    public addBookOpen() {
        $('#modalAdaugaCarte').modal('show');
    }

    public submitBook(title) {
        this.uploadBookPicture(this.fileToUpload, title);
        $('#modalAdaugaCarte').modal('hide');
    }

    public editMyBook(title) {
        if (this.fileToUpload) {
            this.editBookPicture(this.fileToUpload, title);
        } else {
            this.databaseService.editExistingBook(null, title);
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

    public changeInfo(name: string, phone: string, age: string, town: string, ocupation: string) {
        let great = {};
        if (name !== undefined) {
            great["username"] = name;
            this.userDataService.userData.username = name;
        }
        if (phone !== undefined) {
            great["telefon"] = phone;
            this.userDataService.userData.telefon = phone;
        }
        if (age !== undefined) {
            great["varsta"] = age;
            this.userDataService.userData.varsta = age;
        }
        if (town !== undefined) {
            great["oras"] = town;
            this.userDataService.userData.oras = town;
        }
        if (ocupation !== undefined) {
            great["ocupatie"] = ocupation;
            this.userDataService.userData.ocupatie = ocupation;
        }

        $("#modalInfo").modal("hide");
        this.databaseService.changeInformation(great);
    }

    public uploadPoza(event) {
        this.fileToUpload = event;
    }

    uploadBookPicture(event, title) {
        const randomId = Math.random().toString(36).substring(2);
        let ref = this.storage.ref(randomId);
        let task = ref.put(event.target.files[0]).then((result) => {
            ref.getDownloadURL().subscribe((obj: any) => {
               let downloadUrl = obj;
               this.databaseService.addNewBook(downloadUrl, title);
            });
        })
    }

    editBookPicture(event, title) {
        const randomId = Math.random().toString(36).substring(2);
        let ref = this.storage.ref(randomId);
        let task = ref.put(event.target.files[0]).then((result) => {
            ref.getDownloadURL().subscribe((obj: any) => {
                let downloadUrl = obj;
                this.databaseService.editExistingBook(downloadUrl, title);
            });
        });
    }

    public modalPozaProfil() {
        $('#modalprofil').modal("show");
    }

    public uploadProfilePhoto(event) {
        this.profilePhotoToUpload = event;
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
}