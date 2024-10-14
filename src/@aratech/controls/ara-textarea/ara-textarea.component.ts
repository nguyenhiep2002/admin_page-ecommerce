import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'ara-textarea',
    templateUrl: './ara-textarea.component.html',
    styleUrls: ['./ara-textarea.component.scss']
})
export class AraTextareaComponent implements OnInit {
    @Input() tabIndex: number;
    @Input() rows: number;
    @Input() label: string;
    @Input() name: string;
    @Input() controlName: string;
    @Input() required: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() group: FormGroup;
    @Input() ngModel: string;
    @Output() ngModelChange: EventEmitter<string> = new EventEmitter();
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

    clear() {
        this.ngModel = '';
        this.change();
    }
}
