import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent {
  @HostBinding('class.subject') 1;
  @Input() img: string;
  @Input() imgBefore: string;
  @Input() imgAfter: string;
  @Input() title: string;
  @Input() text: string;
  @Input() providerId: number;
  @Output() onClick = new EventEmitter();
  @Output() openEvent: EventEmitter<string> = new EventEmitter<string>();
  @HostListener('click', ['$event'])
  public onHostClick(event: any): void {
    this.onClick.emit(event);
  }

  constructor(private router: Router) { }

  open() {
    this.openEvent.emit();
  }

  loadProviderProfile(id) {
    this.router.navigate(['provider-profile', id]);
  }
}
