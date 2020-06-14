import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {MatStepper} from '@angular/material/stepper';

import * as html2pdf from 'html2pdf.js';

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
          this.pageCount = data.slides.length;
          this.getMyTakeaways();
          this.getKeyTakeaways();
          this.addTags();
        });
    });
  }

  addTags() {
    for (const slide of this.content.slides) {
      if (slide.tags === undefined) {
        slide.tags = [{
          indices: { start: 8, end: 14 },
          cssClass: 'capsule-orange',
          data: { user: { id: 1 } }
        }];
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

  createPDF() {
    const element = document.getElementById('worksheet');
    const opt = {
      margin: [0.5, 1, 1, 1],
      filename: this.content.title + '.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    };

    html2pdf().set(opt).from(element).save();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
    this.pageIndex = stepper.selectedIndex + 1;
  }

  goForward(stepper: MatStepper) {
    stepper.next();
    this.pageIndex = stepper.selectedIndex + 1;
  }
}
