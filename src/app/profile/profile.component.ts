import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
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
    public fileToUpload: any = null;
    public profilePhotoToUpload: any = null;

    constructor(
        public userDataService: UserDataService,
        public storage: AngularFireStorage,
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
        let myBooksIds = [];

        for(let i = 1; i<= this.userDataService.userData.bookNumber; i++) {
            myBooksIds.push(this.userDataService.userData.email.split(".").join("!") + "_" + i);
        }

        this.databaseService.setBooksArray(myBooksIds, this.myBooks, ['myBooks']);
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

    public addBookOpen() {
        $('#modalAdaugaCarte').modal('show');
    }

    public submitBook(title) {
        this.uploadBookPicture(this.fileToUpload, title);
        $('#modalAdaugaCarte').modal('hide');
    }

    public editeazaInformatii() {
        $('#modalInfo').modal('show');
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