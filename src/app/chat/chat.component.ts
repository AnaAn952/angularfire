import { Component } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';
import { AngularFireDatabase } from '@angular/fire/database';


declare let $: any;

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent {

    constructor(
        public userDataService: UserDataService,
        public databaseService: DatabaseService,
        public db: AngularFireDatabase,
    ) {
        let list = this.db.list('/chat/');
        let a = list.valueChanges().subscribe((data: any) => {
            console.log(data);
            this.items = data;
        });
    }

    public items: any[] = [];

    public trimiteRaspuns(value: string) {
        this.databaseService.sendChatResponse({
             text: value,
             profilePicture: this.userDataService.userData.profilePicture || this.userDataService.defaultProfilePicture,
             user: this.userDataService.userData.email,
             timestamp: new Date().toUTCString(),
        });
    }
}