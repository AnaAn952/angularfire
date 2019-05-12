import { Component, ViewChild } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { EventsService } from '../services/fetch-books.service';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent {

    @ViewChild("input5") input: any;

    constructor(
        public userDataService: UserDataService,
        public databaseService: DatabaseService,
        public db: AngularFireDatabase,
        public events: EventsService,
    ) {
        this.usersRef = this.db.list('/users/');
        this.searchUser("");
        let event = this.events.searchChatUsers.subscribe(() => {
            this.searchUser("");
            if (this.users) {
                event.unsubscribe();
            }
        });
    }

    public messages: any = [];
    public usersRef: any;
    public users: any[] = [];
    public currentUser: any = {};
    public sub;

    public sameItem(item): boolean {
        return item.user === localStorage.getItem("email");
    }

    public trimiteRaspuns(value: string) {
        if (!value) {
            return;
        }
        this.input.nativeElement.value = "";
        this.databaseService.sendChatResponse(
        this.currentUser,
        {
            text: value,
            user: this.userDataService.userData.email,
            timestamp: new Date().toUTCString(),
        });
    }

    public searchUser(value: string) {
        this.users = [];
        if (value === "") {
            if (this.userDataService.userData.myChats === undefined || this.userDataService.userData.myChats.length === 0) {
                return;
            }
            let sub = this.usersRef.valueChanges().subscribe((users) => {
                for (let user of users) {
                    if (Object.values(this.userDataService.userData.myChats).indexOf(user.email) >= 0) {
                        this.users.push(user);
                    }
                }
                sub.unsubscribe();
            });
        } else {
            let sub = this.usersRef.valueChanges().subscribe((users) => {
                for (let user of users) {
                    if (user.email.toLowerCase().indexOf(value.toLowerCase()) >= 0 || user.username.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        this.users.push(user);
                    }
                }
                sub.unsubscribe();
            });
        }
    }

    public startChat(user: any) {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        this.messages = [];
        this.currentUser = user;
        let users = [this.currentUser.email, localStorage.getItem("email")].sort();
        let id = this.databaseService.convertToDatabaseFormat(users.toString().replace(",", "_"));
        let dbReference = this.db.list('/chat/' + id);
        this.sub = dbReference.valueChanges().subscribe((data) => {
            this.messages = data;
            setTimeout(() => {
                this.scrollBottom();
            });
        });
    }

    public scrollBottom() {
        let messages = document.getElementById("chatdata");
        messages.scrollTop = messages.scrollHeight;
    }
}