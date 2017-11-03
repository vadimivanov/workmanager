import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent {
  @HostBinding('class.quote') 1;
  @Input() avatarUrl: string;
  @Input() text: string;
  @Input() author: string;
  @Input() company: string;
}
