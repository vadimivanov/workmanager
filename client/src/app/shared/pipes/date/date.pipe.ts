import { Pipe, PipeTransform } from '@angular/core';
import { DateValue } from '../../models/date.model';

@Pipe({
  name: 'datePipe'
})
export class DatePipe implements PipeTransform {

  transform(value: string, separator): string {
    if (value !== undefined) {
      const toDateType = new Date(value),
        date = toDateType.getDate(),
        month = toDateType.getMonth(),
        year = toDateType.getFullYear(),
        hours = toDateType.getHours(),
        minutes = toDateType.getMinutes(),
        time = [(hours > 9 ? '' : '0') + hours, (minutes > 9 ? '' : '0') + minutes].join(':');
      return [(date > 9 ? '' : '0') + date, DateValue[month], year].join(' ') + separator + time;
    }
    return null;
  }
}
