import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare let $:any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    user = {
        email: '',
        password: ''
    };

    constructor(
        public authService: AuthService,
        public router: Router
    ) {}

    public googleSignIn() {
        this.authService.googleSignIn()
            .then(() => {
                $('#exampleModal').modal('hide');
            });
    }

    public logout() {
        this.authService.logout();
        $('#exampleModal2').modal('hide');
    }

    signInWithEmail() {
        this.authService.signInRegular(this.user.email, this.user.password)
            .then((res) => {
                $('#exampleModal').modal('hide');
                this.router.navigate(['']);
            })
            .catch((err) => console.log('error: ' + err));
    }

    createAccount() {
        console.log('here');
        this.authService.createNewUser(this.user.email, this.user.password)
            .then((res) => {
            this.authService.logout();
            console.log('lala');
                $('#exampleModal').modal('hide');
                this.router.navigate(['']);
            })
            .catch((err) => console.log(err));
    }
}
