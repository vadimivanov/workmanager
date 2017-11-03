import {Input, Output, EventEmitter} from '@angular/core';

export abstract class MultipartForm<T> {
  @Input()
  public entity: T;

  @Input()
  public editMode: boolean = false;

  @Output()
  public onNext: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public onPrevious: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public onCancel: EventEmitter<void> = new EventEmitter<void>();

  next(): void {
    this.onNext.emit();
  }

  back(): void {
    this.onPrevious.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
