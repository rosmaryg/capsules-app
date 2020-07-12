import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Highlight} from '../shared/highlight/highlight/highlight.model';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal.component.html',
  styleUrls: ['./notes-modal.component.scss']
})
export class NotesModalComponent implements OnInit {

  type: string;
  notes: string;
  highlight: Highlight;

  constructor(public dialogRef: MatDialogRef<NotesModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.type = data.type;
    this.highlight = data.highlight;

    if (this.type === 'highlightNotes') {
      this.notes = this.highlight.notes;
    } else if (this.type === 'notes') {
      this.notes = data.notes;
    }
  }

  cancel() {
    this.dialogRef.close({
      action: 'cancel',
      notes: this.notes
    });
  }

  delete() {
    this.dialogRef.close({
      action: 'delete',
      notes: this.notes
    });
  }

  save() {
    this.dialogRef.close({
      action: 'save',
      notes: this.notes
    });
  }

  ngOnInit(): void {
    document.getElementById('note-text').blur();
  }

}
