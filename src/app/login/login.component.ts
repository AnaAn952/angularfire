import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from '../services/userData.service';
import { Location } from '@angular/common';

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
        password: ''
    };

    constructor(
        public authService: AuthService,
        public router: Router,
        public userData: UserDataService,
    ) {}

    ngOnInit() {}

    googleSignIn() {
        this.authService.googleSignIn()
            .then(() => {
                $('#exampleModal').modal('hide');
                window.localStorage.setItem('email', this.user.email);
                this.authService.onLogin.emit(this.user.email);
            });
    }

    signInWithEmail() {
        this.authService.signInRegular(this.user.email, this.user.password)
            .then(() => {
                $('#exampleModal').modal('hide');
                window.localStorage.setItem('email', this.user.email);
                this.authService.onLogin.emit(this.user.email);
            })
            .catch((err) => console.log('error: ' + err));
    }

    createAccount() {
        this.authService.createNewUser(this.user.email, this.user.password)
            .then(() => {
                this.authService.logout();
                $('#exampleModal3').modal('hide');
                this.dbRef.push({email: this.user.email});
                this.router.navigate(['']);
            })
            .catch((err) => console.log(err));
    }


    public logout() {
        this.authService.logout();
        $('#exampleModal2').modal('hide');
        this.userData.setUserData({});
        window.localStorage.removeItem('email');

        window.location.replace(window.location.origin + '/#/');
    }

    public isLoggedIn(): boolean {
        return !!window.localStorage.getItem('email');
    }
}
