import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateTimeUtils } from '@aratech/utils/dateTimeUtils';

@Component({
    selector: 'ara-info',
    templateUrl: './ara-info.component.html',
    styleUrls: ['./ara-info.component.scss']
})
export class AraInfoComponent implements OnInit, OnChanges {    
    @Input() label: string;
    @Input() ngModel: string;
    @Input() textarea: boolean = false;
    dataType: number = 0;
    types = {
        text: 0,
        number: 1,
        date: 2,
        textarea: 3,
    };
    value: any;


    constructor() { }

    ngOnInit() {
        this.value = this.ngModel;
        if (this.textarea) {
            this.dataType = this.types.textarea;
        }
        else if (DateTimeUtils.isDateType(this.ngModel)) {
            this.dataType = this.types.date;
        }
        else if (typeof(this.ngModel) == 'number') {
            this.dataType = this.types.number;
        }
        else {
            this.dataType = this.types.text;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.ngModel) {
            this.ngOnInit();
        }
    }
}
