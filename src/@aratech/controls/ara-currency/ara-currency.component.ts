import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CurrencyMaskInputMode } from "ngx-currency";


@Component({
    selector: 'ara-currency',
    templateUrl: './ara-currency.component.html',
    styleUrls: ['./ara-currency.component.scss']
})
export class AraCurrencyComponent implements OnInit, OnChanges {    
    @Input() tabIndex: number;
    @Input() label: string;
    @Input() name: string;
    @Input() controlName: string;
    @Input() align: string = 'right';
    @Input() suffix: string = '';
    @Input() precision: number = 3;
    @Input() allowNegative: boolean = false;
    @Input() required: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() showFullDecimal: boolean = false;
    @Input() group: FormGroup;
    @Input() araModel: number;
    @Input() extendErrors: any[];
    @Output() araModelChange: EventEmitter<number> = new EventEmitter();
    @Output() onBlur: EventEmitter<number> = new EventEmitter();
    @Output() onFocus: EventEmitter<number> = new EventEmitter();
    errors: any = {};
    myModel: number;
    inputMode = CurrencyMaskInputMode.NATURAL;

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
        if (value) {
            numberValue = Number.parseFloat(`${value}`.replace(/,/g, ''));
        }
        else if (`${value}` === '0') {
            numberValue = 0;
        }

        this.myModel = value;
        this.araModelChange.emit(numberValue);
    }

    onBlurInput() {
        var numberValue = undefined;
        if (this.myModel || `${this.myModel}` === '0') {
            numberValue = Number.parseFloat(`${this.myModel}`.replace(/,/g, ''));
        }
        else if (`${this.myModel}` === '0') {
            numberValue = 0;
        }

        this.onBlur.emit(numberValue);
    }

    onFocusInput() {
        this.onFocus.emit();
    }
}
