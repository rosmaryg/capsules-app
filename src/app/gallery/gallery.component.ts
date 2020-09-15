import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Capsule} from '../shared/capsule/capsule.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnChanges {
  gridView = true;
  capsules: Array<Capsule>;
  sortBy = {
    label: 'Popularity',
    icon: 'popular',
    sortAscending: true
  };
  sortAscending = true;
  sortByOptions = [
    {
      label: 'Difficulty',
      icon: 'easy',
      sortAscending: true
    },
    {
      label: 'Recent',
      icon: 'recent',
      sortAscending: true
    },
    this.sortBy,
    {
      label: 'Topic',
      icon: 'topic',
      sortAscending: true
    },
    {
      label: 'Author',
      icon: 'author',
      sortAscending: true
    }
  ];

  hover: boolean;

  constructor(private githubJsonService: GithubJsonService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.githubJsonService.getDirectory()
        .subscribe((data: Array<any>) => {
          this.capsules = data;
        });
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log(changes);
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

    this.sort();
  }


  openDetails(capsule) {
    const dialogRef = this.dialog.open(CapsuleDetailsDialogComponent, {
      panelClass: 'full-screen-dialog',
      data: capsule
    });
  }

  sort() {

    console.log('sorting');

    switch (this.sortBy.label) {
      case 'Popularity':
        break;
      case 'Difficulty':
        this.capsules.sort((a, b) => (a.title > b.title) ? (this.sortAscending ? 1 : -1 ) : (this.sortAscending ? -1 : 1 ));
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
  }
}

@Component({
  selector: 'app-capsule-details',
  templateUrl: './capsule-details-dialog.html',
  styleUrls: ['./gallery.component.scss']
})
export class CapsuleDetailsDialogComponent {

  constructor(public dialogRef: MatDialogRef<CapsuleDetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
  }

  close(): void {
    this.dialogRef.close();
  }
}

