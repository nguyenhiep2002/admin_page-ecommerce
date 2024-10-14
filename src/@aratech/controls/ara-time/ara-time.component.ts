import { Component, Input, OnInit, Output } from '@angular/core'
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms'
import moment from 'moment'

@Component({
    selector: 'ara-time',
    templateUrl: './ara-time.component.html',
    styleUrls: ['./ara-time.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AraTimeComponent,
            multi: true
        }
    ]
})
export class AraTimeComponent implements ControlValueAccessor {
    @Input() value: string = moment().clone().format('HH:mm:ss')
    @Input() disabled: boolean = false
    onChangeTime: (value: string) => void
    onTouchTime: (touch: boolean) => void

    onChangeValue(event: any) {
        this.onChangeTime(event.target.value)
        this.onTouchTime(true)
    }

    registerOnChange(fn: any): void {
        this.onChangeTime = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouchTime = fn
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled
    }

    writeValue(obj: any): void {
        this.value = obj
    }
}
