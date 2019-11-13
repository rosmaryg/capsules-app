import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'capsules-app';
  githubOauthUrl = 'https://github.com/login/oauth/authorize?client_id=d0c8d82ad66e26b4d64d&scope=repo,user:email';

  navBarItems = [
    {
      name: 'Gallery',
      route: '/gallery'
    },
    {
      name: 'Admin',
      route: '/admin'
    },
    {
      name: 'Contact',
      route: '/contact'
    },
    {
      name: 'Login',
      route: '/oauth',
      queryParams: { externalUrl: this.githubOauthUrl }
    }
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'download',
      this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.deployUrl}/assets/icons/download.svg`));
    this.matIconRegistry.addSvgIcon(
      'signal_cellular_1_bar',
      this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.deployUrl}/assets/icons/signal_cellular_1_bar.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'signal_cellular_2_bar',
      this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.deployUrl}/assets/icons/signal_cellular_2_bar.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'signal_cellular_3_bar',
      this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.deployUrl}/assets/icons/signal_cellular_3_bar.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      'signal_cellular_4_bar',
      this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.deployUrl}/assets/icons/signal_cellular_4_bar.svg`)
    );
  }
}
