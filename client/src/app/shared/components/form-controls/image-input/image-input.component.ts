import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostBinding, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss']
})
export class ImageInputComponent implements OnInit, OnChanges {
  @HostBinding('class.image-input') 1;
  @Input()
  public imageUrl = 'assets/images/content/img-logo-placeholder.png';

  @Input()
  public src: string | SafeStyle = '';

  @Input()
  public labl = 'Logo hochladen';

  @Input()
  public readonly = false;

  @Input()
  public membersPhoto = false;

  @Output()
  public select: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput: ElementRef;

  safeSrc: SafeStyle;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.membersPhoto) {
      this.labl = 'Foto hochladen';
    }
  }

  ngOnChanges(changes: any) {
    if (changes.imageUrl) {
      this.src = changes.imageUrl.currentValue;
    }
  }

  triggerInput(): void {
    this.fileInput.nativeElement.click();
  }

  onChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.src = this.sanitizer.bypassSecurityTrustStyle(`url(${URL.createObjectURL(file)})`);
      this.select.emit(file);
    }
  }
}
