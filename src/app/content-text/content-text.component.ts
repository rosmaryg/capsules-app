import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {TextSelectEvent} from '../text-select/text-select.directive';
import {MdePopoverTrigger} from '@material-extended/mde';
import {Highlight} from '../shared/highlight/highlight/highlight.model';
import {NotesModalComponent} from '../notes-modal/notes-modal.component';
import {MatDialog} from '@angular/material/dialog';


interface SelectionRectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-content-text',
  templateUrl: './content-text.component.html',
  styleUrls: ['./content-text.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentTextComponent implements OnInit, OnChanges {
  left = 0;
  top = 0;

  // popover was opened to manipulate a highlight (and not as a response to text selection)
  highlightPopover = false;

  @Input() text: string;

  @Input() highlights: Highlight[];
  @Output() highlightsChange = new EventEmitter<Array<Highlight>>();

  highlightedText = [];
  highlightIds = [];

  public hostRectangle: SelectionRectangle | null;

  private selectedText: Highlight;
  private clickedText: Highlight;

  @ViewChild(MdePopoverTrigger) trigger: MdePopoverTrigger;

  // I initialize the app-component.
  constructor(public dialog: MatDialog) {

    this.hostRectangle = null;
    this.selectedText = null;
  }

  ngOnInit(): void {
    for (const highlight of this.highlights) {
      this.highlightIds.push(highlight.id);
    }

    this.updateHighlights();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.highlights) {
      this.updateHighlights();
    }
  }

  // ---
  // PUBLIC METHODS.
  // ---

  // I render the rectangles emitted by the [textSelect] directive.
  public renderRectangles( event: TextSelectEvent ) : void {

    // If a new selection has been created, the viewport and host rectangles will
    // exist. Or, if a selection is being removed, the rectangles will be null.
    if ( event.hostRectangle ) {
      this.left = event.hostRectangle.left + event.hostRectangle.width / 2;
      this.top = event.hostRectangle.top - 5;
      this.trigger.openPopover();
      this.hostRectangle = event.hostRectangle;
      this.selectedText = event.text;

    } else {
      this.trigger.closePopover();
      this.left = 0;
      this.top = 0;
      this.hostRectangle = null;
      this.selectedText = null;
    }

  }

  highlight() {

    if(this.clickedText) {
      return; // if an already highlighted text is being clicked, there is not highlight action
    }

    this.selectedText.top = this.top;
    this.selectedText.left = this.left;
    this.selectedText.id = this.generateId();
    this.highlights.push(this.selectedText);
    this.updateHighlights();

    // Now that we've shared the text, let's clear the current selection.
    document.getSelection().removeAllRanges();
    // CAUTION: In modern browsers, the above call triggers a "selectionchange"
    // event, which implicitly calls our renderRectangles() callback. However,
    // in IE, the above call doesn't appear to trigger the "selectionchange"
    // event. As such, we need to remove the host rectangle explicitly.
    this.hostRectangle = null;
    this.selectedText = null;
  }

  openDialog(highlight) {
    const dialogRef = this.dialog.open(NotesModalComponent, {
      panelClass: 'full-screen-dialog',
      autoFocus: false, // needed to prevent text area from being focused on when opened
      data: {
        highlight: this.getHighlight(highlight.id)
      }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data === undefined) return;
        switch (data.action) {
          case 'save':
            this.getHighlight(highlight.id).notes = data.notes;
            this.updateHighlights();
            break;
          case 'delete':
            this.highlights.splice(this.highlights.indexOf(this.getHighlight(highlight.id)), 1);
            this.updateHighlights();
            break;
          case 'cancel':
          default:
            break;
        }

        this.highlightClose();
      }
    );
  }

  getHighlight(id) {
    for (const highlight of this.highlights) {
      if (highlight.id === id) return highlight;
    }
  }

  generateId() {
    const rand = '_' + Math.random().toString(36).substr(2, 9);
    return this.highlightIds.indexOf(rand) === -1 ? rand : this.generateId();
  }

  updateHighlights() {
    // clone the highlights array
    const highlightsArray = [...this.highlights];

    highlightsArray.sort((a: Highlight, b: Highlight) => {
      return a.start - b.start;
    });

    let tracker = 0;
    this.highlightedText = [];

    if (highlightsArray.length === 0) {
      this.highlightedText.push({
        content: this.text,
        highlight: false
      });
      return;
    }

    for (const highlight of highlightsArray) {
      if (tracker < highlight.start) {
        // get regular text
        this.highlightedText.push({
          content: this.text.substring(tracker, highlight.start),
          highlight: false
        });
        tracker = highlight.start;
      }

      // get highlighted text
      this.highlightedText.push({
        content: this.text.substring(highlight.start, highlight.end),
        highlight: true,
        type: this.getHighlightType(highlight),
        top: highlight.top,
        left: highlight.left,
        id: highlight.id
      });
      tracker = highlight.end;
    }

    this.highlightedText.push({
      content: this.text.substring(tracker, this.text.length),
      highlight: false
    });
  }

  highlightClick(text) {
    if (this.highlightPopover) {
      this.trigger.closePopover();
    }
    this.left = text.left;
    this.top = text.top;
    this.highlightPopover = true;
    this.clickedText = text;
    this.trigger.openPopover();
  }

  highlightClose() {
    if (this.highlightPopover) {
      this.left = 0;
      this.top = 0;
      this.highlightPopover = false;
      this.trigger.closePopover();
    }

    this.clickedText = null;
  }

  deleteHighlight() {
    this.highlights.splice(this.highlights.indexOf(this.getHighlight(this.clickedText.id)), 1);
    this.highlightClose();
    this.updateHighlights();
  }

  takeNoteOnHighlight() {
    this.openDialog(this.clickedText);
  }

  getHighlightType(highlight) {
    return highlight.notes && highlight.notes !=='' ? 'notes' : 'highlight';
  }

  getHighlightSelectionType() {
    if (this.highlightPopover) {
      const highlight = this.getHighlight(this.clickedText.id);
      return this.getHighlightType(highlight);
    } else {
      return 'selection';
    }
  }

  hasHighlight(highlightedText) {
    return this.getHighlightType(this.getHighlight(highlightedText.id)) === 'highlight';
  }

  hasNote(highlightedText) {
    return this.getHighlightType(this.getHighlight(highlightedText.id)) === 'notes';
  }
}
