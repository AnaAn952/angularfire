import { Component, Input } from '@angular/core';

@Component({
    selector: 'chat-item',
    templateUrl: './chat-item.component.html',
    styleUrls: ['./chat-item.component.css'],
})
export class ChatItemComponent {
    @Input("item") item: any;

    public defaultProfilePicture = "https://firebasestorage.googleapis.com/v0/b/book-website-sharing.appspot.com/o/2ydq27fp2wg?alt=media&token=8c44703d-b739-4d35-ad2f-e383ac4d4780";
}