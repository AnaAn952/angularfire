import { Component, Input } from '@angular/core';

@Component({
    selector: 'catalogue-item',
    templateUrl: './item.component.html',
})
export class ItemComponent {
    @Input('item') item: any;
}