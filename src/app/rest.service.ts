import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './shared/config.interface';
import { Page } from './shared/redditpage.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private isLogged = false;
  private configUrl = 'assets/config.json';
  private redditUrl = 'https://www.reddit.com/';
  private redditSearchUrl = 'search.json?q='
  private subRedditSearchUrl = 'subreddits/search.json?q='

  constructor(private http: HttpClient) { }

  getConfig() {
    // return this.http.get(this.configUrl);
    return this.http.get<Config>(this.configUrl);
  }

  getRedditPage(endpoint: string, after: string): Promise<Page> {
    return this.http.get<Page>(`${this.redditUrl}${endpoint}.json?after=${after}`)
      .toPromise();
  }

  searchRedditPage(search: string): Promise<Page> {
    return this.http.get<Page>(`${this.redditUrl}${this.redditSearchUrl}${search}`)
      .toPromise();
  }

}
