import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GithubJsonService {
  githubBaseUrl = 'https://gitcdn.link/cdn/' + environment.repoOwner + '/capsules-content/master/';
  githubCommentsBaseUrl = 'https://gitcdn.link/cdn/' + environment.repoOwner + '/capsules-content/master/comments/';
  githubContentBaseUrl = 'https://gitcdn.link/cdn/' + environment.repoOwner + '/capsules-content/master/content/';
  jsonExt = '.json';

  constructor(private http: HttpClient) { }

  getDirectory() {
    const url = this.githubBaseUrl + 'directory' + this.jsonExt;

    return this.http.get(url);
  }

  getComments(contentId) {
    const url = this.githubCommentsBaseUrl + contentId + this.jsonExt;

    return this.http.get(url);
  }

  getContent(contentId) {
    const url = this.githubContentBaseUrl + contentId + this.jsonExt;

    return this.http.get(url);
  }

}
