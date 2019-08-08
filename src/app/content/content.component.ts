import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {GithubJsonService} from '../service/github-json/github-json.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  private sub: any;
  idString = 'id';
  content: any;

  slideConfig = {
    infinite: false,
    slidesToShow: 1
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private githubJsonService: GithubJsonService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const contentId = params[this.idString];

      this.githubJsonService.getContent(contentId)
        .subscribe((data: any) => {
          this.content = data;
        });
    });
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
