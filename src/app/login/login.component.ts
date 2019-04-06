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
    public allowRegisterForm: boolean = false;
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
                this.router.navigate(['books']);
                // this.eventService.onLogin.emit(this.user.email);
            })
            .catch((err) => console.log('error: ' + err));
    }

    createAccount() {
        this.authService.createNewUser(this.user.email, this.user.password)
            .then(() => {
                this.authService.logout();
                let index = this.user.email.split(".").join("!");
                this.dbRef.set(index, {email: this.user.email, username: this.user.username, profilePicture: this.user.profilePicture});
                this.allowRegisterForm = false;
            })
            .catch((err) => console.log(err));
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
        this.allowRegisterForm = true;
    }

    public alreadyRegistered() {
        this.allowRegisterForm = false;
    }
}
