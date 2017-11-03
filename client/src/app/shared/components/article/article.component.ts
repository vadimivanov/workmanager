import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {
  @HostBinding('class.article') 1;
  @Input() articleImg: string;
  @Input() articleLink: string;
}
