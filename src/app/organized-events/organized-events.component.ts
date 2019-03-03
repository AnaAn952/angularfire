import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from '../services/database.service';

@Component({
    selector: 'organized-events-item',
    templateUrl: './organized-events.component.html',
    styleUrls: ['./organized-events.component.css'],
})
export class OrganizedEventsComponent {

   constructor(
       public db: AngularFireDatabase,
       public databaseService: DatabaseService,
   ) {
       let list = this.db.list('/events/');
       let a = list.valueChanges().subscribe((data: any) => {
           this.items = data.reverse();
       })
   }

   public items: any[] = [];

}