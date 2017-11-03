import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-truncate',
  templateUrl: './text-truncate.component.html',
  styleUrls: ['./text-truncate.component.scss']
})
export class TextTruncateComponent implements OnInit {
  isTruncate: boolean;
  isShowTextTruncate = false;
  textTruncate: string;

  @HostBinding('class.text-truncate-block') 1;
  @Input() countSymbols: number = 160;
  @Input() text: string;

  ngOnInit() {
    if (this.text.length > this.countSymbols) {
      this.isTruncate = true;
      this.isShowTextTruncate = true;
      this.textTruncate = this.text.slice(0, this.countSymbols);
    } else {
      this.isTruncate = false;
    }
  }

  toggleTextTruncate() {
    this.isShowTextTruncate = !this.isShowTextTruncate;
  }
}
