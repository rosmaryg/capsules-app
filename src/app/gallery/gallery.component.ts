import {Component, Inject, OnInit} from '@angular/core';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  capsules: Array<any>;
  sortBy: any;
  sortAscending = true;
  sortByOptions = [
    {
      label: 'Popularity',
      icon: 'thumbs_up_down',
      sortAscending: true
    },
    {
      label: 'Recent',
      icon: 'av_timer',
      sortAscending: true
    },
    {
      label: 'Difficulty',
      icon: 'vertical_align_center',
      sortAscending: true
    },
    {
      label: 'Topic',
      icon: 'book',
      sortAscending: true
    },
    {
      label: 'Author',
      icon: 'person',
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

  openDetails(capsule) {
    const dialogRef = this.dialog.open(CapsuleDetailsDialogComponent, {
      panelClass: 'full-screen-dialog',
      data: capsule
    });
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
    console.log(data);
  }

  close(): void {
    this.dialogRef.close();
  }
}

