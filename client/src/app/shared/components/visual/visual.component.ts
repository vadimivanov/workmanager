import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss']
})
export class VisualComponent implements OnInit {
  @HostBinding('class.visual') 1;
  @HostBinding('style.background-image') componentBg: string;
  @Input() bgImageUrl: string;
  @Input() isLink = true;

  ngOnInit() {
    this.componentBg = this.bgImageUrl ? `url(${this.bgImageUrl})` : 'url(assets/images/backgrounds/bg-visual.jpg)';
  }
}
