import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  url = 'https://api.github.com';
  contentRepoName = 'capsules-content';
  contentRepoOwner = 'jy-america';
  httpOptions: object;

  constructor(private http: HttpClient) {}

  setHeaders() {
    if (this.httpOptions === undefined) {
      if (localStorage.getItem('access_token')) {
        this.httpOptions = {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
          })
        };
      }
    }
  }

  getName() {
    this.setHeaders();
    return this.http.get(`${this.url}/user`, this.httpOptions);
  }

  getUserRepos(user: string) {
    this.setHeaders();
    return this.http.get(`${this.url}/repos/${user}/${this.contentRepoName}`, this.httpOptions);
  }

  forkContentRepo() {
    this.setHeaders();
    return this.http.post(`${this.url}/repos/${this.contentRepoOwner}/${this.contentRepoName}/forks`, null, this.httpOptions);
  }

  getContentRepoBranches(user: string) {
    this.setHeaders();
    return this.http.get(`${this.url}/repos/${user}/${this.contentRepoName}/branches`, this.httpOptions)
  }
}
