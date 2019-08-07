import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Config } from '../shared/config.interface';
import { Page } from '../shared/redditpage.model';
import { SafeUrl, DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { $ } from 'protractor';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  @ViewChild("myElem", {static: false}) MyProp: ElementRef;
  @Input() public showOver18: boolean;
  @Input() public after: string;
  @Input() public config: Config;
  @Input() public page: Page;
  @Input() public restLoading: boolean;
  @Input() public currentPage: number;
  @Input() public searchPage: boolean;
  @Input() public toTopPage: Subject<boolean>;
  @Output() getConfigEvent: EventEmitter<null> = new EventEmitter<null>();
  @Output() getRedditPageEvent: EventEmitter<null> = new EventEmitter<null>();
  @Output() changeEndpoint: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeAfter: EventEmitter<string> = new EventEmitter<string>();
  @Output() isLoading: EventEmitter<null> = new EventEmitter<null>();
  @Output() changeCurrentPage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.toTopPage.subscribe(v => {
      this.toTop();
    });
    this.getRedditPage();
  }

  public cleanURL(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public cleanIframe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(new DOMParser().parseFromString(html, 'text/html').documentElement.textContent);
  }

  public showConfig(): void {
    this.getConfigEvent.emit(null);
  }

  public getRedditPage(): void {
    this.getRedditPageEvent.emit(null);
  }

  public openArticle(url: string): void {
    window.open(url, '_blank');
  }

  public openSubredit(event): void {
    this.changeEndpoint.emit(event);
    this.getRedditPage();
  }

  public nextPage(event): void {
    this.changeCurrentPage.emit(this.currentPage+1);
    this.isLoading.emit(null);
    this.changeAfter.emit(event);
    this.getRedditPage();
  }

  public resetFeed(): void {
    this.changeCurrentPage.emit(1);
    this.isLoading.emit(null);
    this.changeAfter.emit('null');
    this.getRedditPage();
  }

  public toTop() {
    if(this.MyProp != undefined) {
      this.MyProp.nativeElement.scrollTo(0, 0);
    }
  }
}
