import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'ara-number',
    templateUrl: './ara-number.component.html',
    styleUrls: ['./ara-number.component.scss']
})
export class AraNumberComponent implements OnInit {
    @Input() tabIndex: number;
    @Input() label: string;
    @Input() name: string;
    @Input() controlName: string;
    @Input() required: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() group: FormGroup;
    @Input() ngModel: number;
    @Input() minVal: number;
    @Input() maxVal: number;
    @Output() ngModelChange: EventEmitter<number> = new EventEmitter();
    errors: any = {};

    constructor() { }

    ngOnInit() {
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

    change() {
        this.ngModelChange.emit(this.ngModel);
    }
}
