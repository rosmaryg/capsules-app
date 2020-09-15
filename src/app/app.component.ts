import {Component, OnInit} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import {AuthService} from './services/auth/auth.service';
import {GithubService} from './services/github/github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'capsules-app';
  userName = '';
  contributor = false;
  contentRepoPresent = true;
  contentRepoSource = true; // verifying that the source of the content repo is jy-america

  githubOauthUrl = 'https://github.com/login/oauth/authorize?client_id=d0c8d82ad66e26b4d64d&scope=repo,user:email';

  navBarItems = [
    {
      name: 'Home',
      route: '/gallery'
    },
    {
      name: 'About Us',
      route: '/about'
    },
    {
      name: 'FAQs',
      route: '/faqs'
    }
  ];

  navBarLogout = {
    name: 'Logout',
    route: '/'
  };

  navBarLogin = {
    name: 'Login',
    route: '/oauth',
    queryParams: { externalUrl: this.githubOauthUrl }
  };

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private githubService: GithubService
  ) { }

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.githubService.getName().subscribe((data: any) => {
        this.userName = data.login;
        this.githubService.getUserRepos(this.userName).subscribe((repo: any) => {
          if (repo.fork && repo.parent.full_name === 'jy-america/capsules-content') {
            this.contributor = true;
          } else {
            this.contentRepoSource = false;
          }
        }, error => {
          if (error.status === 404) {
            this.contentRepoPresent = false;
          }
        });
      });
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  becomeAContriutor() {
    if (this.contentRepoPresent && !this.contentRepoSource) {
      // there is a content repo but it has an incorrect source
      // TODO: show user a dialog to rename or delete the existing content repo
    } else if (!this.contentRepoPresent) {
      // there is no content repo, fork from origin
      this.githubService.forkContentRepo().subscribe((data: any) => {
        console.log(data);
      });
    }
  }
}
