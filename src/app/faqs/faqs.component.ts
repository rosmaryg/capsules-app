import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  items = [
    {
      question: 'How can I learn to use Catholic Capsules?',
      answer: 'Start with our “Get Started” Capsules and click through: you will be walked through the features by the end.'
    },
    {
      question: 'Is there a Capsule I should start with?',
      answer: 'We recommend starting with an “easy” level Catholic Capsule just to get used to the flow. Browse through the available topics and choose one that most interests you or something that you have thought about before.'
    },
    {
      question: 'Do I have to go in order?',
      answer: 'Although some capsules will be part of a series, each of them are also individually sharable.'
    },
    {
      question: 'What can I use Catholic Capsules for?',
      answer: 'Catholic Capsules are most helpful for sharing a topic with a group. It can remove the guesswork about what topic to choose or how long it might take you to prepare. Its personal sharing and discussion questions help add extra elements that make sharing with the group much more interesting.'
    },
    {
      question: 'How is the content for Catholic Capsules chosen?',
      answer: 'Catholic Capsules are drawn from the great riches of the Catholic Church from saints to modern writers to Popes - Capsule authors then add key takeaways and other details to bring it to you in Capsule form. '
    },
    {
      question: 'What type of groups are these ideal to use in?',
      answer: 'Members of small faith sharing or fellowship groups can easily use Capsules. '
    },
    {
      question: 'Do I have to share in the way listed in the Catholic Capsule?',
      answer: 'Catholic Capsules are meant to be a tool for your use: feel free to mix and match or make any adjustments that help you. '
    },
    {
      question: 'Does every person in the group need to read the Catholic Capsules?',
      answer: 'Only the person presenting must definitely read and prepare the Catholic Capsules - of course the discussion will be much richer if others do as well, but it is not necessary.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
