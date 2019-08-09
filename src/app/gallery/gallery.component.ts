import { Component, OnInit } from '@angular/core';
import {GithubJsonService} from '../services/github-json/github-json.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  capsules: Array<any>;

  constructor(private githubJsonService: GithubJsonService) { }

  ngOnInit() {
    this.githubJsonService.getDirectory()
      .subscribe((data: Array<any>) => {
        this.capsules = data;
      });
  }
}
