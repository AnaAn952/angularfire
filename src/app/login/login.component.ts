import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from '../services/userData.service';
import { EventsService } from '../services/fetch-books.service';

declare let $:any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public dbRef: any;
    user = {
        email: '',
        password: '',
        username: '',
        profilePicture: 'https://firebasestorage.googleapis.com/v0/b/book-website-sharing.appspot.com/o/2ydq27fp2wg?alt=media&token=8c44703d-b739-4d35-ad2f-e383ac4d4780',
    };

    constructor(
        public authService: AuthService,
        public router: Router,
        public userData: UserDataService,
        public db: AngularFireDatabase,
        public eventService: EventsService,
    ) {
        this.dbRef = db.list('/users');
    }

    ngOnInit() {}

    googleSignIn() {
        this.authService.googleSignIn()
            .then(() => {
                $('#exampleModal').modal('hide');
                window.localStorage.setItem('email', this.user.email);
                this.eventService.onLogin.emit(this.user.email);
            });
    }

    signInWithEmail() {
        this.authService.signInRegular(this.user.email, this.user.password)
            .then(() => {
                $('#exampleModal').modal('hide');
                window.localStorage.setItem('email', this.user.email);
                window.location.reload();
                // this.eventService.onLogin.emit(this.user.email);
            })
            .catch((err) => console.log('error: ' + err));
    }

    createAccount() {
        this.authService.createNewUser(this.user.email, this.user.password)
            .then(() => {
                this.authService.logout();
                $('#exampleModal3').modal('hide');
                let index = this.user.email.split(".").join("!");
                this.dbRef.set(index, {email: this.user.email, username: this.user.username, profilePicture: this.user.profilePicture});
                this.router.navigate(['']);
            })
            .catch((err) => console.log(err));
    }


    public logout() {
        this.authService.logout();
        this.user.email = '';
        this.user.username = '';
        this.user.password = '';
        $('#exampleModal2').modal('hide');
        this.userData.setUserData({});
        window.localStorage.removeItem('email');

        window.location.replace(window.location.origin + '/#/');
    }

    public isLoggedIn(): boolean {
        return !!window.localStorage.getItem('email');
    }

    public openModal() {
        this.user.email = '';
        this.user.username = '';
        this.user.password = '';
        $('#exampleModal3').modal('hide');
        $('#exampleModal').modal('show');
    }

    public openModal3() {
        this.user.email = '';
        this.user.username = '';
        this.user.password = '';
        $('#exampleModal').modal('hide');
        $('#exampleModal3').modal('show');
    }
}
