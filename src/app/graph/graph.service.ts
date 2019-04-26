import { Injectable } from '@angular/core';
import ug from 'ug-ts'
import { AngularFireDatabase } from '@angular/fire/database';
import { UserDataService } from '../services/userData.service';
import { EventsService } from '../services/fetch-books.service';

@Injectable()
export class GraphService {

    public graph;
    public dbRef;
    constructor(
        public db: AngularFireDatabase,
        public userData: UserDataService,
        public events: EventsService,
    ) {
        this.dbRef = db.list("/cartile");

        let subsciption = this.dbRef.valueChanges().subscribe((books => {
            this.graph = new ug.Graph();

            // creeaza noduri pentru genuri : id-ul = genul
            for (let type of ["fictiune", "istorie", "enciclopedie", "memorii si biografii", "psihologie si dezvoltare personala", "culinare", "pentru copii"]) {
                this.graph.createNode('type', {type: type});
            }

            // creeaza noduri pentru toate cartile : id-ul = codul din baza de date
            for (let book of books) {
                if (book.status !== "indisponibil") {
                    let bookNode = this.graph.createNode('book', {id: book.id});

                    // creeaza noduri pentru toti autorii : id-ul = numele
                    if (!this.graph.nodes('author').query().filter({name__ilike: book.autor}).units().length) {
                        this.graph.createNode('author', {name: book.autor});
                    }

                    // creeaza noduri pentru toti userii : id-ul = emailul
                    if (book.solicitanti) {
                        for (let solicitant of Object.values(book.solicitanti)) {
                            if (!this.graph.nodes('user').query().filter({email__ilike: solicitant}).units().length) {
                                this.graph.createNode('user', {email: solicitant});
                            }

                            // leaga cartea de solicitant
                            let user = this.graph.nodes('user').query().filter({email__ilike: solicitant}).units()[0];
                            this.graph.createEdge("book-user").link(bookNode, user).setDistance(3);
                        }
                    }

                    // leaga cartea de genul ei
                    let type = this.graph.nodes('type').query().filter({type__ilike: book.gen}).units()[0];
                    this.graph.createEdge("book-type").link(bookNode, type).setDistance(2);

                    // leaga cartea de autorul ei
                    let autor = this.graph.nodes('author').query().filter({name__ilike: book.autor}).units()[0];
                    this.graph.createEdge("book-author").link(bookNode, autor).setDistance(1);
                }
            }

            console.log('genuri', this.graph.nodes('type').query().filter({type__ilike: ''}).units());
            console.log('carti', this.graph.nodes('book').query().filter({id__ilike: ''}).units());
            console.log('autori', this.graph.nodes('author').query().filter({name__ilike: ''}).units());
            console.log('solicitanti', this.graph.nodes('user').query().filter({email__ilike: ''}).units());

            let currentUser = this.graph.nodes('user').query().filter({email__ilike: localStorage.getItem("email")}).units()[0];
            let paths = this.graph.closest(currentUser, {
                compare: function(node) {
                    return node.entity === 'book';
                },
                minDepth: 4,
                maxDepth: 9,
            });

            for (let i = 0; i <= 3; i++) {
                if (paths[i]) {
                    let length = paths[i]._raw.length;
                    this.userData.recommendedBooksIds.push(paths[i]._raw[length-1].properties.id);
                }
            }

            this.events.resetRecomandate.emit();
            subsciption.unsubscribe();
            console.log(this.userData.recommendedBooksIds);
        }));
    }
}