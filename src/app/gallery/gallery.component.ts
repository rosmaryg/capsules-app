import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Capsule} from '../shared/capsule/capsule.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { environment } from '../../environments/environment';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnChanges {
  repoOwner = environment.repoOwner;
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
              private _bottomSheet: MatBottomSheet,
              public dialog: MatDialog,
              public breakpointObserver: BreakpointObserver
  ) { }

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

    if (this.breakpointObserver.isMatched(Breakpoints.XSmall) || this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.openDetailsBottomSheet(capsule);
    } else {
      this.openDetailsDialog(capsule);
    }
  }

  openDetailsDialog(capsule) {
    const dialogRef = this.dialog.open(CapsuleDetailsDialogComponent, {
      panelClass: 'full-screen-dialog',
      data: capsule
    });
  }

  openDetailsBottomSheet(capsule) {
    this._bottomSheet.open(CapsuleDetailsBottomSheetComponent, {
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
  selector: 'app-capsule-details-dialog',
  templateUrl: './capsule-details-dialog.html',
  styleUrls: ['./gallery.component.scss']
})
export class CapsuleDetailsDialogComponent {
  repoOwner = environment.repoOwner;

  constructor(public dialogRef: MatDialogRef<CapsuleDetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
  }

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-capsule-details-bottom-sheet',
  templateUrl: 'capsule-details-bottom-sheet.html',
  styleUrls: ['./gallery.component.scss']
})
export class CapsuleDetailsBottomSheetComponent {
  repoOwner = environment.repoOwner;

  constructor(private _bottomSheetRef: MatBottomSheetRef<CapsuleDetailsBottomSheetComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  close(): void {
    this._bottomSheetRef.dismiss();
  }
}

