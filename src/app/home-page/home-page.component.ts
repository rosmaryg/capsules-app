import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  slides = [
    {img: 'https://media4.s-nbcnews.com/j/newscms/2017_47/2233721/171120-smile-stock-njs-333p_4ecd5b9a2aefbfdfbc3331c6d474d963.' +
        'fit-760w.jpg'},
    {img: 'https://live-mmk-galileo.s3-eu-west-1.amazonaws.com/sites/galileo.morganmckinley.co.uk/files/people_smiling.jpg'}
  ];

  slideConfig = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1
  };

  constructor() { }

  ngOnInit() {
  }
}
