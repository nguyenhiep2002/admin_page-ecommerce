import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'ara-percent',
    templateUrl: './ara-percent.component.html',
    styleUrls: ['./ara-percent.component.scss']
})
export class AraPercentComponent implements OnInit, OnChanges {    
    @Input() tabIndex: number;
    @Input() label: string;
    @Input() name: string;
    @Input() controlName: string;
    @Input() align: string = 'right';
    @Input() suffix: string = ' %';
    @Input() precision: number = 2;
    @Input() required: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() group: FormGroup;
    @Input() araModel: number;
    @Output() araModelChange: EventEmitter<number> = new EventEmitter();
    errors: any = {};
    myModel: number;

    constructor() { }

    ngOnInit() {
        this.myModel = this.araModel;
        if (this.group) {
            const control = this.group.get(this.controlName);
            if (control) {
                control.valueChanges.subscribe(() => {
                    this.errors = {};
                    if (!control.valid && !control.pending)
                        this.errors = control.errors;
                });
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.araModel) {
            this.myModel = this.araModel;
        }
    }

    change(value) {
        var numberValue = undefined;
        if (value || value == '0') {
            numberValue = Number.parseFloat(`${value}`.replace(/,/g, ''));        
        }
        this.myModel = value;
        this.araModelChange.emit(numberValue);
    }
}
