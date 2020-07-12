import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {MatStepper} from '@angular/material/stepper';

import * as html2pdf from 'html2pdf.js';
import {Highlight} from '../shared/highlight/highlight/highlight.model';
import {NotesModalComponent} from '../notes-modal/notes-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  pageIndex = 1;
  pageCount = 10;
  private sub: any;
  idString = 'id';
  content: any;
  personalReflection = '';
  selectedQuestions = [];
  selectedKeyTakeaways = [];
  selectedVideos = [];
  keyTakeaways = [];
  myTakeaways = [];

  // highlightsMap = new Map<string, Highlight>();

  private pdfBorder: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private githubJsonService: GithubJsonService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const contentId = params[this.idString];

      this.githubJsonService.getContent(contentId)
        .subscribe((data: any) => {
          this.content = data;
          this.pageCount = data.slides.length;
          this.getKeyTakeaways();
          this.collectHighlights();
        });
    });
  }

  collectHighlights() {
    for (const slide of this.content.slides) {
      if (slide.highlights === undefined) {
        slide.highlights = [];
      }
    }
  }

  getKeyTakeaways() {
    for (const slide of this.content.slides) {
      for (const keyTakeAway of slide.keyTakeAways) {
        this.keyTakeaways.push(keyTakeAway);
      }
    }
  }

  isEligible(value) {
    if (value !== null && value.trim().length > 0) {
      return value;
    }
  }

  getVideos() {
    if (this.content.meta.hasVideos) {
      return this.content.meta.videoURL.split(';').filter(this.isEligible);
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  updateSelectedList(list, item) {
    if (list.includes(item.trim())) {
      list.splice(list.indexOf(item.trim()), 1);
    } else {
      list.push(item.trim());
    }
  }

  createPDF() {
    const element = document.getElementById('worksheet');
    const opt = {
      margin: [0.5, 1, 1, 1],
      filename: this.content.title + '.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    };

    return {
      element,
      opt
    }
  }

  printPDF() {
    const pdfOptions = this.createPDF();
    html2pdf().set(pdfOptions.opt).from(pdfOptions.element).toPdf().get('pdf').then(pdf => {
      window.open(pdf.output('bloburl'), '_blank');
    });
  }

  savePDF() {
    const pdfOptions = this.createPDF();
    html2pdf().set(pdfOptions.opt).from(pdfOptions.element).save();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
    this.pageIndex = stepper.selectedIndex + 1;
  }

  goForward(stepper: MatStepper) {
    stepper.next();
    this.pageIndex = stepper.selectedIndex + 1;
  }

  getHighlightKeys(highlightsMap) {
    return Array.from(highlightsMap.keys());
  }

  openDialog(type, highlight?: Highlight, notes?: string) {
    return this.dialog.open(NotesModalComponent, {
      panelClass: 'full-screen-dialog',
      autoFocus: false, // needed to prevent text area from being focused on when opened
      data: {
        type,
        notes,
        highlight
      }
    });
  }

  openHighlightDialog(slide, highlight) {
    const dialogRef = this.openDialog('highlightNotes', highlight);

    dialogRef.afterClosed().subscribe(
      data => {
        switch (data.action) {
          case 'save':
            highlight.notes = data.notes;
            break;
          case 'delete':
            slide.highlights.splice(slide.highlights.indexOf(highlight), 1);
            break;
          case 'cancel':
          default:
            break;
        }

        slide.highlights = [...slide.highlights];
        this.collectHighlights();
      }
    );
  }

  openNoteDialog(slide) {
    const dialogRef = this.openDialog('notes', null, slide.additionalNotes);

    dialogRef.afterClosed().subscribe(
      data => {
        switch (data.action) {
          case 'save':
            slide.additionalNotes = data.notes;
            break;
          case 'delete':
            slide.additionalNotes = '';
            break;
          case 'cancel':
          default:
            break;
        }
      }
    );
  }

  getHighlights() {
    const highlights = [];

    for (const slide of this.content.slides) {
      if (slide.highlights) {
        for (const highlight of slide.highlights) {
          highlights.push(highlight);
        }
      }
    }

    return highlights;
  }

  updateHighlights(text, highlightsMap) {
    // clone the highlights array
    const highlightsArray = [];

    for (const highlightPair of highlightsMap) {
      const [highlightId, highlight] = highlightPair;
      highlight.id = highlightId;
      highlightsArray.push(highlight);
    }

    highlightsArray.sort((a: Highlight, b: Highlight) => {
      return a.start - b.start;
    });

    let tracker = 0;
    const highlightedText = [];

    if (highlightsArray.length === 0) {
      highlightedText.push({
        content: text,
        highlight: false
      });
      return;
    }

    for (const highlight of highlightsArray) {
      if (tracker < highlight.start) {
        // get regular text
        highlightedText.push({
          content: text.substring(tracker, highlight.start),
          highlight: false
        });
        tracker = highlight.start;
      }

      // get highlighted text
      highlightedText.push({
        content: text.substring(highlight.start, highlight.end),
        highlight: true,
        top: highlight.top,
        left: highlight.left,
        id: highlight.id
      });
      tracker = highlight.end;
    }

    highlightedText.push({
      content: text.substring(tracker, text.length),
      highlight: false
    });

    return highlightedText;
  }
}
