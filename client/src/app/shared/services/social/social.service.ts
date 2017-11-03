import { Injectable } from '@angular/core';

@Injectable()
export class SocialService {

  constructor() { }

  share(data) {
    let href = data.link;
    let title = data.title;
    let name = data.name;
    let text = data.body;

    switch (name) {
      case 'twitter':
        window.open('https://twitter.com/share?text=' + title + '&url=' + href);
        break;
      case 'facebook':
        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' +
          encodeURIComponent(title) +
          '&p[summary]=' + encodeURIComponent(text) +
          '&p[url]=' + encodeURIComponent(href) +
          '&p[images][0]=' + encodeURIComponent('https://okornok-uploads.s3.eu-central-1.amazonaws.com/%D1%81%D0%BF%D0%B0%D1%81%D0%B8%D0%B1%D0%BE.jpg')
          , '', 'toolbar=0,status=0,width=626,height=436');
        break;
      case 'google-plus':
        window.open('https://plus.google.com/share?url=' + href);
        break;
      case 'linkedin':
        window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + href);
        break;
      default:
        break;
    }
  }
}
