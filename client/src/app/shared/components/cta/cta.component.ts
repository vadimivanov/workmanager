import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss']
})
export class CtaComponent implements OnInit {
  @HostBinding('class.cta') 1;
  @HostBinding('style.background-image') componentBg: string;
  @Input() title: string;
  @Input() isControlGroup = true;
  @Input() bgImageUrl: string;
  @Input() ctaIco: string | boolean;
  @Input() ctaPlaceholder: string;

  ngOnInit() {
    this.componentBg = this.bgImageUrl ? `url(${this.bgImageUrl})` : 'url(assets/images/backgrounds/bg-cta.jpg)';
  }
}
