import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  private sub: any;
  idString = 'id';
  content: any;
  personalReflection = '';
  selectedQuestions = [];
  selectedKeyTakeaways = [];
  selectedVideos = [];
  keyTakeaways = [];
  myTakeaways = [];

  slideConfig = {
    infinite: false,
    slidesToShow: 1,
    draggable: false
  };
  private pdfBorder: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private githubJsonService: GithubJsonService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const contentId = params[this.idString];

      this.githubJsonService.getContent(contentId)
        .subscribe((data: any) => {
          this.content = data;
          this.getMyTakeaways();
          this.getKeyTakeaways();
        });
    });
  }

  getKeyTakeaways() {
    for (const slide of this.content.slides) {
      for (const takeaway in slide.keyTakeAways) {
        this.keyTakeaways.push(slide.keyTakeAways[takeaway]);
      }
    }
  }

  getMyTakeaways() {
    this.myTakeaways = [];
    for (const slide of this.content.slides) {
      if (slide.yourTakeAways !== '') {
        this.myTakeaways.push(slide.yourTakeAways);
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

  buildPDF() {
    // tslint:disable-next-line:one-variable-per-declaration
    const pageWidth = 8.5,
      lineHeight = 1.2,
      margin = 0.75,
      maxLineWidth = pageWidth - margin * 2,
      fontSize = 12,
      ptsPerInch = 72,
      oneLineHeight = fontSize * lineHeight / ptsPerInch;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      lineHeight
    });

    const yourTakeaways = [];

    for (const slide of this.content.slides) {
      yourTakeaways.push(slide.yourTakeAways);
    }

    const questionsText = this.selectedQuestions.join('\n');
    const videosText = this.selectedVideos.join('\n');
    const keyTakeawaysText = this.selectedKeyTakeaways.join('\n');
    const yourTakeawaysText = yourTakeaways.join('\n');

    const contentTitleLines = doc
      .setFont('helvetica', 'bold')
      .setFontSize(fontSize * 2)
      .splitTextToSize(this.content.title, maxLineWidth);

    let x = 0;
    let y = 0;

    const imageFile = this.http.get<any>('assets/images/takeaway_border.json')
      .subscribe((data: object) => {
        // @ts-ignore
        this.pdfBorder = data.border;
        doc.addImage(this.pdfBorder, 'PNG', x, y, 8.5, 1);
        x = margin;
        y = y + 1 + 2 * oneLineHeight;

        doc.setFontStyle('bold')
          .setFontSize(fontSize * 2)
          .text(contentTitleLines, pageWidth / 2, y, null, null, 'center');

        x = margin;
        y += (contentTitleLines.length * fontSize * lineHeight / ptsPerInch) + (2 * oneLineHeight);

        y = this.addSectionToPdf('My Notes', yourTakeaways, fontSize, maxLineWidth, oneLineHeight,
          x, y, doc);

        y = this.addSectionToPdf('My Personal Sharing', this.personalReflection, fontSize, maxLineWidth, oneLineHeight,
          x, y, doc);

        y = this.addSectionToPdf('Key Takeaways', this.selectedKeyTakeaways, fontSize, maxLineWidth, oneLineHeight,
          x, y, doc);

        y = this.addSectionToPdf('Discussion Questions', this.selectedQuestions, fontSize, maxLineWidth, oneLineHeight,
          x, y, doc);

        if (this.content.meta.hasVideos) {
          y = this.addSectionToPdf('Video(s) to Share', this.selectedVideos, fontSize, maxLineWidth, oneLineHeight,
             x, y, doc);
        }

        if (this.content.meta.hasActivities) {
          y = this.addSectionToPdf('Activity', this.content.meta.activityDescription, fontSize, maxLineWidth, oneLineHeight,
            x, y, doc);
        }

        const textHeight = contentTitleLines.length * fontSize * lineHeight / ptsPerInch;
        // doc.setFontStyle('bold')
        //   .text('Text Height: ' + textHeight + ' inches', margin, margin + oneLineHeight);

        // doc.autoPrint();
        doc.save(this.content.title + '- TakeAwaySheet.pdf');

      });
  }

  addSectionToPdf(title, body, fontSize, maxLineWidth, oneLineHeight, x, y, doc) {
    const titleLine = doc
      .setFont('helvetica', 'bold')
      .setFontSize(fontSize)
      .splitTextToSize(title, maxLineWidth);

    const bodyTextArray = [];
    let bodyLines = [];
    let bodyLength = 0;
    if (Array.isArray(body)) {
      for (const line of body) {
        const bodyLine = doc
          .setFont('helvetica', 'normal')
          .setFontSize(fontSize)
          .splitTextToSize(line, maxLineWidth);

        bodyLength += bodyLine.length;
        bodyTextArray.push(bodyLine);
      }
    } else {
      bodyLines = doc
        .setFont('helvetica', 'normal')
        .setFontSize(fontSize)
        .splitTextToSize(body, maxLineWidth);

      bodyLength = bodyLines.length;
    }

    if (titleLine.length * oneLineHeight + bodyLength * oneLineHeight + y > 10.5) {
      doc.addPage();
      doc.addImage(this.pdfBorder, 'PNG', 0, 0, 8.5, 0.5);
      y = 0.5 + 2 * oneLineHeight;
    }

    doc.setFontStyle('bold')
      .setFontSize(fontSize)
      .text(titleLine, x, y);

    y += (titleLine.length * oneLineHeight) + (0.75 * oneLineHeight);

    if (Array.isArray(body)) {
      for (const line of bodyTextArray) {
        doc.setFontStyle('normal')
          .setFontSize(fontSize)
          .text(line, x + 0.1, y);

        y += (line.length * oneLineHeight) + (0.5 * oneLineHeight);
      }
      y += (1.5 * oneLineHeight);
    } else {
      doc.setFontStyle('normal')
        .setFontSize(fontSize)
        .text(bodyLines, x, y);

      y += (bodyLines.length * oneLineHeight) + (2 * oneLineHeight);
    }

    return y;
  }
}
