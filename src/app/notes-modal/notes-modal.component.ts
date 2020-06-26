import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Highlight} from '../shared/highlight/highlight/highlight.model';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal.component.html',
  styleUrls: ['./notes-modal.component.scss']
})
export class NotesModalComponent implements OnInit {

  highlight: Highlight;

  constructor(public dialogRef: MatDialogRef<NotesModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.highlight = data.highlight;
  }

  cancel() {
    this.dialogRef.close({
      action: 'cancel',
      notes: this.highlight.notes
    });
  }

  delete() {
    this.dialogRef.close({
      action: 'delete',
      notes: this.highlight.notes
    });
  }

  save() {
    this.dialogRef.close({
      action: 'save',
      notes: this.highlight.notes
    });
  }

  ngOnInit(): void {
    document.getElementById('note-text').blur();
  }

}
