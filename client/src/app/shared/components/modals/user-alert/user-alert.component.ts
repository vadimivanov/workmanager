import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './user-alert.component.html',
  styleUrls: ['./user-alert.component.scss']
})
export class UserAlertComponent {
  @HostBinding('class.toast') 1;
  @HostBinding('class.toast--active') isToastActive = false;

  public show(): void {
    this.isToastActive = true;
    setTimeout(() => this.hide(), 3000);
  }

  public hide(): void {
    this.isToastActive = false;
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('toast__inner')) {
      this.hide();
    }
  }
}
