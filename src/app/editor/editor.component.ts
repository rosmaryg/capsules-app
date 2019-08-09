import { Component, OnInit } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {ActivatedRoute, Router} from '@angular/router';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {SlickComponent} from 'ngx-slick';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  private sub: any;
  idString = 'id';
  slideTemplate = {
    content: '',
    keyTakeAways: [
      ''
    ],
    yourTakeAways: ''
  };
  slideConfig = {
    infinite: false,
    slidesToShow: 1
  };

  content = {
    title: '',
    subtitle: '',
    author: '',
    description: '',
    img: '',
    slides: [
      {
        title: '',
        subtitle: '',
        content: '',
        keyTakeAways: [
          ''
        ],
        yourTakeAways: ''
      }
    ],
    meta: {
      topic: '',
      difficulty: '',
      author: '',
      hasVideos: false,
      hasActivities: false,
      tags: [],
      rating: 0
    }
  };

  public files: NgxFileDropEntry[] = [];

  static fileType(fileName: string) {
    const allowedFiles = ['.json', '.jpg', '.jpeg', '.png'];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      if (allowedFiles.includes(extension[0])) {
        return extension[0];
      }
    }
    return null;
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private githubJsonService: GithubJsonService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const contentId = params[this.idString];

      if (contentId !== undefined) {
        this.githubJsonService.getContent(contentId)
          .subscribe((data: any) => {
            this.content = data;
          });
      }
    });
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        const reader = new FileReader();

        fileEntry.file((file: File) => {

          const fileType = EditorComponent.fileType(file.name);

          if (fileType === '.json') {
            reader.readAsText(file);
          } else if (fileType === '.png' || fileType === '.jpg' || fileType === '.jpeg') {
            reader.readAsDataURL(file);
          } else {

          }

          reader.onload = () => {
            if (fileType === '.json') {
              const fileString = reader.result as string;
              this.content = JSON.parse(fileString);
              console.log(this.content);
            } else if (fileType === '.png' || fileType === '.jpg' || fileType === '.jpeg') {
              this.content.img = reader.result as string;
            }
          };

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  addSlide(slickModal: SlickComponent) {
    const slide = JSON.parse(JSON.stringify(this.slideTemplate));
    this.content.slides.push(slide);
    setTimeout(() => {
      slickModal.slickGoTo(this.content.slides.length - 1);
    }, 100);
  }

  removeSlide(slidesIndex) {
    this.content.slides.splice(slidesIndex, 1);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.content.meta.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.content.meta.tags.indexOf(tag);

    if (index >= 0) {
      this.content.meta.tags.splice(index, 1);
    }
  }

}
