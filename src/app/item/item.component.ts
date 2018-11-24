import { Component, Input } from '@angular/core';
declare function require(path: string);

@Component({
    selector: 'catalogue-item',
    templateUrl: './item.component.html',
})
export class ItemComponent {
    @Input('item') item: any;
}