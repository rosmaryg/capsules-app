import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Sorter} from '../shared/sorter/sorter.model';
import {Capsule} from '../shared/capsule/capsule.model';

@Component({
  selector: 'app-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: ['./sorter.component.scss']
})
export class SorterComponent implements OnInit {

  @Input() sortBy: Sorter;
  @Output() sortByChange = new EventEmitter<Sorter>();
  @Input() sortAscending: boolean;
  @Output() sortAscendingChange = new EventEmitter<boolean>();
  @Input() sortByOptions: Array<Sorter>;
  @Output() sortByOptionsChange = new EventEmitter<Array<Sorter>>();
  @Input() capsules: Array<Capsule>;
  @Output() capsulesChange = new EventEmitter<Array<Capsule>>();

  constructor() { }

  ngOnInit(): void {
  }

  sort() {

    switch (this.sortBy.label) {
      case 'Popularity':
        break;
      case 'Difficulty':
        this.capsules.sort((a, b) => {
          const aDiff = a.meta.difficulty === 'easy'? 1 : a.meta.difficulty === 'medium' ? 2 : 3;
          const bDiff = b.meta.difficulty === 'easy'? 1 : b.meta.difficulty === 'medium' ? 2 : 3;
          return (aDiff > bDiff) ? (this.sortAscending ? 1 : -1 ) : (this.sortAscending ? -1 : 1 )
        });
        break;
      case 'Recent':
        break;
      case 'Topic':
        this.capsules.sort((a, b) => (a.title > b.title) ? (this.sortAscending ? 1 : -1 ) : (this.sortAscending ? -1 : 1 ));
        break;
      case 'Author':
        this.capsules.sort((a, b) => (a.meta.author > b.meta.author) ? (this.sortAscending ? 1 : -1 ) : (this.sortAscending ? -1 : 1 ));
        break;
      default:
        break;

    }

    this.sortByChange.emit(this.sortBy);
    this.sortAscendingChange.emit(this.sortAscending);
    this.capsulesChange.emit(this.capsules);
  }
}
