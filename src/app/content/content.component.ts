import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {DomSanitizer} from '@angular/platform-browser';

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

  constructor(
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
    console.log(this.content);
    for (const slide of this.content.slides) {
      if (slide.yourTakeAways !== '') {
        this.myTakeaways.push(slide.yourTakeAways);
      }
    }
    console.log(this.myTakeaways);
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

  sanitize(url: string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  buildPDF() {
    const doc = new jsPDF();

    const yourTakeawaysList = [];

    for (const slide of this.content.slides) {
      yourTakeawaysList.push(slide.yourTakeAways);
    }

    doc.text(yourTakeawaysList, 10, 10);
    doc.save(this.content.title + '- TakeAwaySheet.pdf');
  }
}
