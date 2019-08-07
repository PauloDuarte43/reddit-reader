import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public brand = 'Reddit Reader';
  @Input() public endpoint;
  @Input() public showOver18: boolean;
  @Input() public varSaveSub: boolean;
  @Input() public restLoading: boolean;
  @Input() public currentPage: number;
  @Input() public subredditsDefault: Array<[string, string]>;
  @Input() public localSubreddits: Array<[string, string]>;
  @Output() changeEndpoint: EventEmitter<string> = new EventEmitter<string>();
  @Output() getRedditPageEvent: EventEmitter<null> = new EventEmitter<null>();
  @Output() eventChangeOver18: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() eventChangeSaveSub: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() eventRemoveAllSubreddit: EventEmitter<null> = new EventEmitter<null>();
  @Output() isLoading:  EventEmitter<null> = new EventEmitter<null>();
  @Output() changeAfter: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeCurrentPage: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    //console.log(JSON.stringify(this.subredditsDefault));
    //console.log(JSON.parse(JSON.stringify(this.subredditsDefault)));
  }

  public changeOver18(): void {
    this.eventChangeOver18.emit(!this.showOver18);
  }

  public saveSub(): void {
    this.eventChangeSaveSub.emit(!this.varSaveSub);
  }

  public cleanAllSubreddit(): void {
    this.eventRemoveAllSubreddit.emit(null);
  }

  public onChangeSubreddit(event: KeyboardEvent): void {
    this.endpoint = (<HTMLInputElement>event.target).value;
  }

  public changeSubreddit(subreddit): void {
    if (this.restLoading) {
      return;
    }
    this.endpoint = subreddit;
    this.openSubreddit();
  }

  public openSubreddit(): void {
    if (this.endpoint === '') {
      alert('Subreddit vazio!');
      return;
    }
    this.changeCurrentPage.emit(1);
    this.changeAfter.emit(null);
    this.isLoading.emit(null);
    this.changeEndpoint.emit(this.endpoint);
    this.getRedditPageEvent.emit(null);
  }

}
