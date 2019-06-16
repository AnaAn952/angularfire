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
        this.graphs();

        this.events.resetGraph.subscribe(() => {
           this.graphs();
        });
    }

    public graphs() {
        let subsciption = this.dbRef.valueChanges().subscribe((books => {
            this.graph = new ug.Graph();

            // creeaza noduri pentru genuri : id-ul = genul
            for (let type of ["ficțiune", "istorie", "geografie", "științe", "enciclopedie", "memorii și biografii", "psihologie și dezvoltare personală", "culinare", "pentru copii"]) {
                this.graph.createNode('type', {type: type});
            }

            // creeaza noduri pentru toate cartile : id-ul = codul din baza de date
            for (let book of books) {

                let own = Object.keys(book.istorie).map((item: any) => book.istorie[item]).map((item: any) => item.proprietar);

                let bookNode = this.graph.createNode('book', {id: book.id, status: book.status, owners: own});

                // creeaza noduri pentru toti autorii : id-ul = numele
                if (!this.graph.nodes('author').query().filter({name__ilike: book.autor}).units().length) {
                    if (book.autor !== '-') {
                        this.graph.createNode('author', {name: book.autor});
                    }
                }

                // creeaza noduri pentru toti userii : id-ul = emailul
                if (book.solicitanti) {
                    for (let solicitant of Object.values(book.solicitanti)) {
                        if (!this.graph.nodes('user').query().filter({email__ilike: solicitant}).units().length) {
                            this.graph.createNode('user', {email: solicitant});
                        }

                        // leaga cartea de solicitant
                        let user = this.graph.nodes('user').query().filter({email__ilike: solicitant}).units()[0];
                        this.graph.createEdge("book-user").link(bookNode, user).setDistance(2.5);
                    }
                }

                // leaga cartea de genul ei
                let type = this.graph.nodes('type').query().filter({type__ilike: book.gen}).units()[0];
                this.graph.createEdge("book-type").link(bookNode, type).setDistance(2);

                // leaga cartea de autorul ei
                if (book.autor !== "-") {
                    let autor = this.graph.nodes('author').query().filter({name__ilike: book.autor}).units()[0];
                    this.graph.createEdge("book-author").link(bookNode, autor).setDistance(1);
                }
            }

            console.log('genuri', this.graph.nodes('type').query().filter({type__ilike: ''}).units());
            console.log('carti', this.graph.nodes('book').query().filter({id__ilike: ''}).units());
            console.log('autori', this.graph.nodes('author').query().filter({name__ilike: ''}).units());
            console.log('solicitanti', this.graph.nodes('user').query().filter({email__ilike: ''}).units());

            let currentUser = this.graph.nodes('user').query().filter({email__ilike: localStorage.getItem("email")}).units()[0];

            console.log("the current user", currentUser);

            if (currentUser) {
                let paths = this.graph.closest(currentUser, {
                    compare: function(node) {
                        if (node.properties.owners && node.properties.owners.includes(localStorage.getItem("email"))) {
                            return false;
                        }
                        return node.entity === 'book' && node.properties.status !== "indisponibil" && node.properties.status !== "sters";
                    },
                    minDepth: 3.5,
                    maxDepth: 7.5,
                });

                this.userData.recommendedBooksIds = [];

                console.log("paths", paths);

                for (let i = 0; i < paths.length; i++) {
                    if (paths[i] && this.userData.recommendedBooksIds.length < 4) {
                        let length = paths[i]._raw.length;
                        if (Object.values(this.userData.userData.idurileCartilorMele).indexOf(paths[i]._raw[length - 1].properties.id) < 0) {
                            this.userData.recommendedBooksIds.push(paths[i]._raw[length - 1].properties.id);
                        }
                    }
                }

                this.events.resetRecomandate.emit();
            }
            subsciption.unsubscribe();
        }));
    }
}