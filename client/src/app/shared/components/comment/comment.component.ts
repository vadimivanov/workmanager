import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @HostBinding('class.comment') 1;
  @Input() title: string;
  @Input() date: string;
  @Input() text: string;
}
