import { Component, OnInit } from '@angular/core';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {GithubService} from '../services/github/github.service';
import {AuthService} from '../services/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  capsules: Array<any>;
  userName: string;
  inProgressBranches: Array<string>;
  repoOwner = environment.repoOwner;

  constructor(
    private authService: AuthService,
    private githubJsonService: GithubJsonService,
    private githubService: GithubService
  ) { }

  ngOnInit() {
    this.githubJsonService.getDirectory()
      .subscribe((data: Array<any>) => {
        this.capsules = data;
      });

    if (this.authService.isLoggedIn()) {
      this.githubService.getName().subscribe((data: any) => {
        this.userName = data.login;
        this.githubService.getContentRepoBranches(this.userName).subscribe((branches: any) => {
          this.inProgressBranches = [];
          branches.forEach(branch => {
            if (branch.name !== 'master') {
              this.inProgressBranches.push(branch.name);
            }
          });

          console.log(this.inProgressBranches);
        });
      });
    }
  }

  prettyPrintDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }
}
