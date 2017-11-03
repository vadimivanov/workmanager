import { Component, OnChanges, Input } from '@angular/core';

import { Visit } from '../../../../shared/models/visit.model';
import { DateValue, DayValue } from '../../../../shared/models/date.model';
import { InfoDialogComponent } from '../../../../shared/components/modals/info-dialog/info-dialog.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-provider-statistics',
  templateUrl: './provider-statistics.component.html',
  styleUrls: ['./provider-statistics.component.scss']
})
export class ProviderStatisticsComponent implements OnChanges {

  /** Visits array data structure:
   * id
   * created_at
   * updated_at
   * location_coordinates
   * provider_id
   * service
   */
  @Input()
  visits: Array<Visit>;
  private servicesVisits: any = {};
  private servicesSearchDate: any = {};
  onSelectedTab: string = 'byDay';
  /**
   * line type chart data (example)
   */
  public lineChartDataByDay: Array<any> = [];
  public lineChartDataByMonth: Array<any> = [];
  public lineChartDataByYear: Array<any> = [];
  public lineChartLabelsForDays: Array<any> = [];
  public lineChartLabelsForMonth: Array<any> = [];
  public lineChartLabelsForYear: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  /**
   * bar type chart data (example)
   */
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabelsDay: string[];
  public barChartLabelsMonth: string[];
  public barChartLabelsYear: string[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartDataDay: any[];
  public barChartDataMonth: any[];
  public barChartDataYear: any[];
  showCharts = false;

  constructor(
    public dialog: MdDialog
  ) {}

  ngOnChanges() {
    if (!(typeof this.visits === 'undefined')) {
      this.transformData();
      this.showCharts = true;
      this.checkCategories();
    }
  }

  transformData() {
    for (let i = 0; i < this.visits.length; i++) {
      if (!this.servicesVisits.hasOwnProperty(new Date(this.visits[i].created_at).toDateString())) {
        this.servicesVisits[new Date(this.visits[i].created_at).toDateString()] = {};
      }

      if (this.servicesSearchDate.hasOwnProperty(new Date(this.visits[i].created_at).toDateString())) {
        this.servicesSearchDate[new Date(this.visits[i].created_at).toDateString()].count += 1;
      } else if (this.visits[i].created_at) {
        this.servicesSearchDate[new Date(this.visits[i].created_at).toDateString()] = {
          count: 1,
          date: this.visits[i].created_at
        };
      }
    }
    this.transformDataCategories(this.servicesVisits);
    this.createBarChartData(this.onSelectedTab);
    this.createLineChartData(this.onSelectedTab);
  }

  transformDataCategories(categoriesArr) {
    for (let element in categoriesArr) {
      categoriesArr[element] = this.addDataToCategories(new Date(element));
    }
    this.servicesVisits = categoriesArr;
  }

  addDataToCategories(date) {
    date = this.createdDate(date);
    let dateList: Date;
    let result = {};
    for (let i = 0; i < this.visits.length; i++) {
      dateList = this.createdDate(new Date(this.visits[i].created_at));
      if (dateList === date && this.visits[i].service !== null) {
        if (result.hasOwnProperty(this.visits[i].service)) {
          result[this.visits[i].service] += 1;
        } else if (this.visits[i].service) {
          result[this.visits[i].service] = 1;
        }
      }
    }
    return result;
  }

  createdDate(created, str?) {
    if (str) {
      let day = DayValue[created.getDay()],
        month = DateValue[created.getMonth()],
        date = created.getDate(),
        dateNum = (date > 9 ? '' : '0') + date,
        year = created.getFullYear();
      if (str === 'byDay') {
        return day + ' ' + dateNum;
      } else if (str === 'byMonth') {
        return day + ' ' + month + ' ' + dateNum + ' ' + year;
      } else if (str === 'byYear') {
        return year;
      }
    } else {
      let day = created.getDay(),
        month = created.getMonth(),
        date = created.getDate(),
        dateNum = (date > 9 ? '' : '0') + date,
        year = created.getFullYear();
      return year + '-' + month + '-' + day;
    }
  }

  createLineChartData(tab) {
    let currentDate = new Date();
    if (tab === 'byDay') {
      this.lineChartLabelsForDays = [];
      this.lineChartDataByDay = [{
        label: 'Suchanfragen pro Tag',
        data: []
      }];
      for (let name in this.servicesSearchDate) {
        let element = new Date(name);
        if (element.getMonth() === currentDate.getMonth()) {
          if (currentDate.getDate() - element.getDate() <= 7) {
            let date = this.createdDate(element, tab);
            this.lineChartLabelsForDays.push(date);
            this.lineChartDataByDay[0].data.push(this.servicesSearchDate[name].count);
          }
        }
      }
    } else if (tab === 'byMonth') {
      this.lineChartLabelsForMonth = [];
      this.lineChartDataByMonth = [{
        label: 'Suchanfragen pro Tag',
        data: []
      }];
      for (let name in this.servicesSearchDate) {
        let element = new Date(name);
        if (element.getMonth() === currentDate.getMonth()) {
          let date = this.createdDate(element, tab);
          this.lineChartLabelsForMonth.push(date);
          this.lineChartDataByMonth[0].data.push(this.servicesSearchDate[name].count);
        }
      }
    } else if (tab === 'byYear') {
      let count = 0;
      this.lineChartLabelsForYear = [];
      this.lineChartDataByYear = [{
        label: 'Suchanfragen pro Tag',
        data: []
      }];
      for (let name in this.servicesSearchDate) {
        let element = new Date(name);
        let year = this.createdDate(element, tab);
        if (this.lineChartLabelsForYear.indexOf(year) === -1 ) {
          this.lineChartLabelsForYear.push(year);
        }
        count += this.servicesSearchDate[name].count;
      }
      this.lineChartDataByYear[0].data.push(count);
    }
  }

  createBarChartData(tab) {
    let currentDate = new Date();
    if (tab === 'byDay') {
      this.barChartLabelsDay = [];
      this.barChartDataDay = [{
        label: 'Kategorienanfragen',
        data: []
      }];
      let result = {};
      for (let name in this.servicesVisits) {
        let element = new Date(name);
        if (element.getMonth() === currentDate.getMonth()) {
          if (currentDate.getDate() - element.getDate() <= 7) {
            for (let row in this.servicesVisits[name]) {
              if (result.hasOwnProperty(row)) {
                result[row] += this.servicesVisits[name][row];
              } else if (row) {
                result[row] = this.servicesVisits[name][row];
              }
            }
          }
        }
      }
      for (let label in result) {
        this.barChartLabelsDay.push(label);
        this.barChartDataDay[0].data.push(result[label]);
      }
    } else if (tab === 'byMonth') {
      this.barChartLabelsMonth = [];
      this.barChartDataMonth = [{
        label: 'Kategorienanfragen',
        data: []
      }];
      let result = {};
      for (let name in this.servicesVisits) {
        let element = new Date(name);
        if (element.getMonth() === currentDate.getMonth()) {
          for (let row in this.servicesVisits[name]) {
            if (result.hasOwnProperty(row)) {
              result[row] += this.servicesVisits[name][row];
            } else if (row) {
              result[row] = this.servicesVisits[name][row];
            }
          }
        }
      }
      for (let label in result) {
        this.barChartLabelsMonth.push(label);
        this.barChartDataMonth[0].data.push(result[label]);
      }
    } else if (tab === 'byYear') {
      this.barChartLabelsYear = [];
      this.barChartDataYear = [{
        label: 'Suchanfragen pro Tag',
        data: []
      }];
      let result = {};
      for (let name in this.servicesVisits) {
        for (let row in this.servicesVisits[name]) {
          if (result.hasOwnProperty(row)) {
            result[row] += this.servicesVisits[name][row];
          } else if (row) {
            result[row] = this.servicesVisits[name][row];
          }
        }
      }
      for (let label in result) {
        this.barChartLabelsYear.push(label);
        this.barChartDataYear[0].data.push(result[label]);
      }
    }
  }

  chartHovered(e) {
    console.log(e);
  }

  chartClicked(e) {
    console.log(e);
  }

  checkCategories() {
    let count = 0;
    for (let i in this.visits) {
      if (this.visits[i].service === null) {
        count++;
      }
    }
    if (count === this.visits.length) {
      this.errorSendEmailDialog()
    }
  }

  errorSendEmailDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Sie haben keine Kategorienansichten';
  }
}
