import { Component, Input } from '@angular/core';

@Component({
    selector: 'person-item',
    templateUrl: './person-item.component.html',
    styleUrls: ['./person-item.component.css'],
})
export class PersonItemComponent {
    @Input("item") item: any;
}