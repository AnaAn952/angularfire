import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from '../services/userData.service';
import { EventsService } from '../services/fetch-books.service';
import { DatabaseService } from '../services/database.service';
import { TranslateService } from '../services/translate.service';

declare let $:any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public dbRef: any;
    public allowRegisterForm: boolean = false;
    public incorrectAuth: boolean = false;
    public alreadyInUse: boolean = false;
    public badlyFormated: boolean = false;
    public trimis: boolean = false;
    public notMatch: boolean = false;
    public reset: boolean = false;
    public badReset: boolean = false;
    user = {
        email: '',
        password: '',
        passwordAgain: '',
        username: '',
        profilePicture: 'https://firebasestorage.googleapis.com/v0/b/book-website-sharing.appspot.com/o/2ydq27fp2wg?alt=media&token=8c44703d-b739-4d35-ad2f-e383ac4d4780',
    };

    constructor(
        public authService: AuthService,
        public router: Router,
        public userData: UserDataService,
        public db: AngularFireDatabase,
        public eventService: EventsService,
        public databaseService: DatabaseService,
        public translate: TranslateService,
    ) {
        this.dbRef = db.list('/users');
    }

    ngOnInit() {}

    signInWithEmail() {
        this.incorrectAuth = false;
        this.trimis = false;
        this.authService.signInRegular(this.user.email, this.user.password)
            .then(() => {
                $('#exampleModal').modal('hide');
                window.localStorage.setItem('email', this.user.email);
                this.router.navigate(['books']);
                this.resetUserData(this.user.email);
                this.eventService.resetInfo.emit();
                this.eventService.resetGraph.emit();
                // this.eventService.onLogin.emit(this.user.email);
            })
            .catch((err) => {
                this.incorrectAuth = true;
            });
    }

    resetPassword(email: string) {
        this.badReset = false;
        this.authService.resetPassword(email)
            .then(() => {
                this.reset = false;
                this.trimis = true;
            })
            .catch((error) => {
                this.badReset = true;
            });
    }

    createAccount() {
        this.notMatch = false;
        if (this.user.password !== this.user.passwordAgain) {
            this.notMatch = true;
        } else {
            this.alreadyInUse = false;
            this.badlyFormated = false;
            this.authService.createNewUser(this.user.email, this.user.password)
                .then(() => {
                    this.authService.logout();
                    let index = this.user.email.split(".").join("!");
                    this.dbRef.set(index, {
                        email: this.user.email,
                        username: this.user.username,
                        profilePicture: this.user.profilePicture,
                        limba: "română"
                    });
                    this.allowRegisterForm = false;
                })
                .catch((err) => {
                    if (err.message === "The email address is already in use by another account.") {
                        this.alreadyInUse = true;
                    } else if (err.message === "The email address is badly formatted.") {
                        this.badlyFormated = true;
                    }
                });
        }
    }

    public logout() {
        this.authService.logout();
        this.user.email = '';
        this.user.username = '';
        this.user.password = '';
        this.userData.setUserData({});
        window.localStorage.removeItem('email');

        this.router.navigate(['login']);
    }

    public inregistrare() {
        this.incorrectAuth = false;
        this.allowRegisterForm = true;
        this.badlyFormated = false;
        this.alreadyInUse = false;
        this.notMatch = false;
    }

    public alreadyRegistered() {
        this.allowRegisterForm = false;
    }

    public resetUserData(email: any) {
        if (!email) return;
        let list = this.db.list('/users', ref => ref.orderByChild('email').equalTo(email));
        let a = list.valueChanges().subscribe((userData: any) => {
            if (userData[0].email) {
                this.userData.setUserData(userData[0]);
            }
            this.databaseService.currentUser = this.databaseService.convertToDatabaseFormat(localStorage.getItem('email'));
            a.unsubscribe();
        });
    }

    public showResetPassword() {
        this.badReset = false;
        this.incorrectAuth = false;
        this.reset = true;
    }

    public inapoi() {
        this.badReset = false;
        this.reset = false;
    }
}
