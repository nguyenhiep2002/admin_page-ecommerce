import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateTimeUtils } from '@aratech/utils/dateTimeUtils';
import * as moment from "moment";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'ara-month',
    templateUrl: './ara-month.component.html',
    styleUrls: ['./ara-month.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AraMonthComponent implements OnInit, OnChanges {
    @Input() tabIndex: number;
    @Input() label: string;
    @Input() name: string;
    @Input() controlName: string;
    @Input() required: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() monthOnly: boolean = false;
    @Input() group: FormGroup;
    @Input() ngModel: any;
    @Input() min: any;
    @Input() max: any;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    errors: any = {};
    myValue: any;

    constructor() { }

    ngOnInit() {
        this.myValue = this.ngModel;
        if (this.group) {
            const control = this.group.get(this.controlName);
            if (control) {
                control.valueChanges.subscribe(() => {
                    this.errors = {};
                    if (control.dirty && !control.valid && !control.pending)
                        this.errors = control.errors;
                });
            }
        }
    }

    change(event: any, datePicker: MatDatepicker<any>) {
        let value = event.value;
        if (this.min && event.value < this.min) {
            value = undefined;
            this.clear(datePicker);
        }
        
        if (this.max && event.value > this.max) {
            value = undefined;
            this.clear(datePicker);
        }
        
        this.ngModelChange.emit(value);
    }

    openDatePicker(datePicker: MatDatepicker<any>) {
        if (!this.readOnly)
            datePicker.open();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.ngModel) {
            if (this.ngModel == undefined || DateTimeUtils.isDateType(`${this.ngModel}`))
                this.myValue = this.ngModel;
        }
    }

    chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
        normalizedMonth.date(1);
        datepicker.select(normalizedMonth);
        datepicker.close();
        this.myValue = normalizedMonth;
        this.ngModelChange.emit(this.myValue);
    }

    clear(datePicker: MatDatepicker<any>) {
        datePicker.select(undefined);
    }
}
