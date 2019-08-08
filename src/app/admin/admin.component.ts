import { Component, OnInit } from '@angular/core';
import {GithubJsonService} from '../service/github-json/github-json.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  capsules: Array<any>;

  constructor(private githubJsonService: GithubJsonService) { }

  ngOnInit() {
    this.githubJsonService.getDirectory()
      .subscribe((data: Array<any>) => {
        this.capsules = data;
      });
  }

  prettyPrintDate(timestamp) {
    return new Date(timestamp);
  }
}
