import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {BackendService} from '../services/backend/backend.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  private sub: any;
  codeKey = 'code';

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      const code = params[this.codeKey];
      console.log(code);

      this.backendService.getAccessToken(code)
        .subscribe((data: any) => {
          console.log(data);
        });
    });
  }

}
