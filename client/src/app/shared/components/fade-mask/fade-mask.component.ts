import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fade-mask',
  templateUrl: './fade-mask.component.html',
  styleUrls: ['./fade-mask.component.scss']
})
export class FadeMaskComponent implements OnInit {
  show: boolean;

  constructor() { }

  ngOnInit() {
  }

}
