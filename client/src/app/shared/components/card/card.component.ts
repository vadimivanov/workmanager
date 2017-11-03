import {Component, HostBinding, Input, Output, EventEmitter, OnChanges} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges {
  @HostBinding('class.card') 1;
  @Input() name: string;
  @Input() planId: string;
  @Input() title: string;
  @Input() titleSuffix: string;
  @Input() buttonText: string;
  @Input() items: string[];
  @Input() currentUserPlanId: string;
  @Input() isCanManage: false;

  @Output() onButtonClick: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(changes: any) {
    if (changes.isCanManage) {
      this.isCanManage = changes.isCanManage.currentValue;
    }
  }

  isCurrentBillingPlan() {
    return this.currentUserPlanId === this.planId;
  }

  isCanPickPlan() {
    return this.isCanManage && !this.isCurrentBillingPlan();
  }

  buttonClick() {
    this.onButtonClick.emit();
  }
}
