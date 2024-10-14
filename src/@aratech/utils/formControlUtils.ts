import { FormControl, FormGroup } from '@angular/forms'
import { AraValidators } from './validators'
import moment from 'moment'

export class FormControlUtils {
    static processFormValueChange(form: FormGroup, formErrors: any) {
        for (const field in formErrors) {
            if (!formErrors.hasOwnProperty(field)) {
                continue
            }

            // Clear previous errors
            formErrors[field] = {}

            // Get the control
            const control = form.get(field)

            if (control && control.dirty && !control.valid && !control.pending) {
                formErrors[field] = control.errors ? control.errors : {}
            }
        }
    }

    static onFormValueChange(form: FormGroup, formErrors: any) {
        Object.keys(form.controls).forEach(key => {
            formErrors[key] = {}
        })
        form.valueChanges.subscribe(() => {
            FormControlUtils.processFormValueChange(form, formErrors)
        })
    }

    static FormInitControls = Object.assign({}, {
        DateRange: () => new FormGroup({
            start: new FormControl(moment().clone(), [AraValidators.momentValidator]),
            end: new FormControl(moment().clone(), [AraValidators.momentValidator])
        })
    })

    static disableAllControl(formGroup: FormGroup, isDisable: boolean = true) {
        for (const control in formGroup.controls) {
            if (isDisable) {
                formGroup.controls[control].disable()
                continue
            }
            formGroup.controls[control].enable()
        }
    }


}
