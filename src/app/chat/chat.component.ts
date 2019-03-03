import { Component, ViewChild } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { DatabaseService } from '../services/database.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent {

    @ViewChild("input1") input: any;

    constructor(
        public userDataService: UserDataService,
        public databaseService: DatabaseService,
        public db: AngularFireDatabase,
    ) {
        let list = this.db.list('/chat/');
        let a = list.valueChanges().subscribe((data: any) => {
            this.items = data.reverse();
        });
    }

    public items: any[] = [];

    public trimiteRaspuns(value: string) {
        this.input.nativeElement.value = "";
        this.databaseService.sendChatResponse({
             text: value,
             profilePicture: this.userDataService.userData.profilePicture || this.userDataService.defaultProfilePicture,
             user: this.userDataService.userData.email,
             timestamp: new Date().toUTCString(),
        });
    }
}