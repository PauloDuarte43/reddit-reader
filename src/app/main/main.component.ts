import { Component, OnInit, ViewChild, enableProdMode } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { RestService } from '../rest.service';
import { Config } from '../shared/config.interface';
import { Page } from '../shared/redditpage.model';
import { ActivatedRoute } from '@angular/router';
import { PanelComponent } from '../panel/panel.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public config: Config;
  public page: Page;
  public after: string = 'null';
  public endpoint = 'best';
  public restLoading: boolean = false;
  public showOver18 = true;
  public saveSub = false;
  public currentPage: number = 1;
  public toTopPage: Subject<boolean> = new Subject();

  public searchPage = false;

  public subredditsDefault: Array<[string, string]> = [
    ["Best","best"],
    ["New", "new"],
    ["Rising", "rising"],
    ["Controversial","controversial"]
  ];
  public localSubreddits: Array<[string, string]> = [];

  constructor(private configService: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('====================================');
      console.log(params['id']);
      console.log('====================================');
    });
    this.loadLocalSubreddit();
  }

  public changeOver18(over18: boolean) {
    this.showOver18 = over18;
  }

  public changeSaveSub(saveSub: boolean) {
    this.saveSub = saveSub;
  }

  private loadLocalSubreddit(): void {
    if (localStorage.getItem('localSubreddits')) {
      let lSub = JSON.parse(localStorage.getItem('localSubreddits'));
      if (lSub.constructor.name == 'Array') {
        this.localSubreddits = lSub;
      } else {
        localStorage.removeItem('localSubreddits');
        this.localSubreddits = [];
      }
    }
  }

  private saveLocalSubreddit(): void {
    let thisObj = this;

    let isNew = true;

    this.subredditsDefault.forEach(function (value) {
      if (value[1] == thisObj.endpoint) {
        isNew = false;
        return;
      }
    });

    if (isNew) {
      this.localSubreddits.forEach(function (value) {
        if (value[1] == thisObj.endpoint) {
          isNew = false;
          return;
        }
      });
    }

    if (isNew) {
      this.localSubreddits.push([this.endpoint, this.endpoint]);
      localStorage.setItem('localSubreddits', JSON.stringify(this.localSubreddits));
      this.loadLocalSubreddit();
      thisObj.saveSub = false;
    }
  }

  public removeAllSubreddits(): void {
    localStorage.removeItem('localSubreddits');
    this.localSubreddits = [];
  }

  showConfig() {
    this.configService.getConfig()
      .subscribe((data: Config) => this.config = { ...data });
  }

  getRedditPage() {
    //this.restLoading = true;
    this.configService.getRedditPage(this.endpoint, this.after)
      .then((data: Page) => {
        this.searchPage = false;
        this.restLoading = false;
        this.toTopPage.next(true);
        if (this.saveSub) {
          this.saveLocalSubreddit();
        }
        this.page = new Page({ ...data }, this.searchPage);
      }).catch((err: HttpErrorResponse) => {
        this.restLoading = false;
        // alert('Subreddit não encontrado indo para Best');
        // this.endpoint = 'best';
        // this.getRedditPage();
        this.searchReddit();
      });
  }

  searchReddit() {
    //subreddits/search.json?q=fun
    this.configService.searchRedditPage(this.endpoint)
      .then((data: Page) => {
        //this.searchPage = true;
        this.restLoading = false;
        this.toTopPage.next(true);
        this.page = new Page({ ...data }, this.searchPage);
      }).catch((err: HttpErrorResponse) => {
        this.restLoading = false;
        alert('Erro desconhecido indo para "Best"');
        this.searchPage = false;
        this.endpoint = 'best';
        this.getRedditPage();
      });
  }

  public changeEndPoint(endpoint: string) {
    this.endpoint = endpoint;
  }

  public changeAfter(after: string) {
    this.after = after;
  }

  public isLoading(): void {
    this.restLoading = true;
  }

  public changeCurrentPage(page: number) {
    this.currentPage = page;
  }

}
