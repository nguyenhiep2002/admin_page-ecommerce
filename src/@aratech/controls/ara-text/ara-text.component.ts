import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'ara-text',
    templateUrl: './ara-text.component.html',
    styleUrls: ['./ara-text.component.scss']
})
export class AraTextComponent implements OnInit, OnChanges {
    @Input() tabIndex: number;
    @Input() label: string;
    @Input() name: string;
    @Input() controlName: string;
    @Input() required: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() disabled: boolean = false;
    @Input() borderRadius: boolean = false
    @Input() group: FormGroup;
    @Input() inputType: string = 'text';
    @Input() placeholder: string
    @Input() ngModel: string;
    @Input() advancedValidErrors: any[];
    @Output() ngModelChange: EventEmitter<string> = new EventEmitter();
    @Output() onEnter: EventEmitter<any> = new EventEmitter();
    errors: any = {};

    constructor() { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.disabled) {
            const control = this.group.get(this.controlName);
            if (this.disabled) {
                control.disable();
            }
            else {
                control.enable();
            }
        }
    }

    ngOnInit() {
        if (this.group) {
            const control = this.group.get(this.controlName);
            if (this.disabled) {
                control.disable();
            }

            if (control) {
                let check = () => {
                    this.errors = {};
                    if (!control.valid && !control.pending && control.errors)
                        this.errors = control.errors;
                };
                control.statusChanges.subscribe(check);
                control.valueChanges.subscribe(check);
            }
        }
    }

    change() {
        this.ngModelChange.emit(this.ngModel);
    }

    keyPress(event: any) {
        if (event && event.keyCode == 13) {
            this.onEnter.emit();
        }
    }
    clear(){
        this.ngModel = "";
        this.ngModelChange.emit(this.ngModel);
    }

}
