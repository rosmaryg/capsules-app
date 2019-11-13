import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  baseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getAccessToken(code) {
    const url = this.baseUrl + 'github/token/' + code;

    // console.log(url);

    return this.http.get(url);
  }
}
