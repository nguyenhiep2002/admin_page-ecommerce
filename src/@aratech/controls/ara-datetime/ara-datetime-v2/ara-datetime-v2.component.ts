import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Moment } from 'moment'
import moment from 'moment/moment'

@Component({
    selector: 'ara-datetime-v2',
    templateUrl: './ara-datetime-v2.component.html',
    styleUrls: ['./ara-datetime-v2.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AraDatetimeV2Component,
            multi: true
        }
    ]
})
export class AraDatetimeV2Component implements ControlValueAccessor {
    @Input() placeholder: string = ''
    @Input() disabled: boolean = false
    @Input() value: any
    @Input() label: string
    @Input() isCheckFuture: boolean = true
    @Input() isCheckPast: boolean = false
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>()
    onDateChange: (value: any) => void
    onDateTouch: (value: boolean) => void

    constructor() {
    }

    handleDateChange(event: any) {
        this.onDateChange(event.value)
        this.onDateTouch(true)
        this.onChange.emit(event.value)
    }

    filterPicker = (momentDate: moment.Moment | null): boolean => {
        if (!momentDate) return true
        const dateNow = moment().clone()
        if (this.isCheckFuture) return momentDate < dateNow
        if (this.isCheckPast) return momentDate > dateNow
        return true
    }

    registerOnTouched(fn: any): void {
        this.onDateTouch = fn
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled
    }

    registerOnChange(fn: any): void {
        this.onDateChange = fn
    }

    writeValue(obj: any): void {
        this.value = obj
    }
}
