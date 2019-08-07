class ArticlePreview {
  public type = 'default';
  public previewUrl: string;

  constructor(obj: any) {
    if (obj.reddit_video_preview) {
      this.type = 'reddit_video_preview';
      this.previewUrl = obj.reddit_video_preview.fallback_url;
    } else if (obj.images) {
      this.type = 'images';
      this.previewUrl = obj.images[0].source.url;
    }
  }
}

class ArticleMedia {
  public type = 'default';
  public mediaUrl: string;
  public html: string;

  constructor(obj: any) {
    if (obj.reddit_video) {
      this.type = 'reddit_video';
      this.mediaUrl = obj.reddit_video.fallback_url;
    } else if (obj.oembed) {
      this.type = 'oembed';
      this.html = obj.oembed.html;
    }
  }
}

class ArticleData {
  public rawObj: any;
  public title: string;
  public selftext: string;
  public url: string;
  public subreddit: string;
  public subredditNamePrefixed: string;
  public thumbnail: string;
  public isSelf: boolean;
  public showMedia = false;
  public isVideo: boolean;
  public media: ArticleMedia;
  public preview: any;
  public over18: boolean;

  constructor(obj: any) {
    this.rawObj = obj;
    this.title = obj.title;
    this.selftext = obj.selftext;
    this.subreddit = obj.subreddit;
    this.over18 = obj.over_18;
    this.subredditNamePrefixed = obj.subreddit_name_prefixed;
    this.thumbnail = obj.thumbnail;
    this.isSelf = obj.is_self;
    this.url = obj.url;
    this.isVideo = obj.is_video;
    this.media = obj.media ? new ArticleMedia(obj.media) : obj.media;
    this.preview = obj.preview ? new ArticlePreview(obj.preview) : obj.preview;

  }

  public changeShowMedia(): void {
    this.showMedia = !this.showMedia;
  }

}

class SearchData {
  public over18: boolean;
  public url: string;
  public iconUrl: string;
  public description: string;
  public displayName: string;

  constructor(obj: any) {
    this.over18 = obj.over_18;
    this.url = obj.url;
    this.description = obj.public_description;
    this.iconUrl = obj.icon_img;
    this.displayName = obj.display_name_prefixed;
  }
}

class Article {
  public kind: string;
  public articleData: ArticleData;

  constructor(obj: any) {
    this.kind = obj.kind;
    this.articleData = new ArticleData(obj.data);
  }
}

class Search {
  public kind: string;
  public searchData: SearchData;

  constructor(obj: any) {
    this.kind = obj.kind;
    this.searchData = new SearchData(obj.data);
  }
}

export class Page {
  public kind: string;
  public modhash: string;
  public dist: number;
  public children: Article[];
  public search: Search[];
  public after: string;
  public before: string;

  constructor(obj: any, isSearch: boolean) {
    this.kind = obj.kind;
    this.modhash = obj.data.modhash;
    this.dist = obj.data.dist;
    this.children = [];
    this.search = [];

    if (isSearch) {
      obj.data.children.forEach((a) => {
        this.search.push(new Search(a));
      });
    } else {
      obj.data.children.forEach((a) => {
        this.children.push(new Article(a));
      });
    }
    this.after = obj.data.after;
    this.before = obj.data.before;
  }
}
