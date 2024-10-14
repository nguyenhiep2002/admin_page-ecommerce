import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormControlUtils } from '../../utils/formControlUtils'
import moment from 'moment'

@Component({
    selector: 'ara-daterange',
    templateUrl: './ara-daterange.component.html',
    styleUrls: ['./ara-daterange.component.scss']
})

export class AraDateRangeComponent implements OnInit {
    @Input() formGroup: (FormGroup | null) = null
    @Input() disable: boolean = false
    @Input() isCheckFuture: boolean = true
    @Input() isCheckPast: boolean = false
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>()

    defaultFormGroup: FormGroup = FormControlUtils.FormInitControls.DateRange()

    get getStartDate() {
        return this.defaultFormGroup.get('start')
    }

    get getEndDate() {
        return this.defaultFormGroup.get('end')
    }

    ngOnInit(): void {
        if (this.formGroup) this.defaultFormGroup = this.formGroup
    }

    filterPicker = (momentDate: moment.Moment | null): boolean => {
        if (!momentDate) return true
        const dateNow = moment().clone()
        if (this.isCheckFuture) return momentDate < dateNow
        if (this.isCheckPast) return momentDate > dateNow
        return true
    }

    handleOnChange(): void {
        this.onChange.emit(this.defaultFormGroup?.value ?? {})
    }

}
