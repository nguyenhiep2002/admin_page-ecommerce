import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateTimeUtils } from '@aratech/utils/dateTimeUtils';

@Component({
    selector: 'ara-datetime',
    templateUrl: './ara-datetime.component.html',
    styleUrls: ['./ara-datetime.component.scss']
})
export class AraDateTimeComponent implements OnInit, OnChanges {
    @Input() tabIndex: number;
    @Input() label: string;
    @Input() name: string;
    @Input() controlName: string;
    @Input() required: boolean = false;
    @Input() readOnly: boolean = false;
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

    clear(datePicker: MatDatepicker<any>) {
        datePicker.select(undefined);
    }
}
