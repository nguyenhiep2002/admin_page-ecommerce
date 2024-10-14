import { FormControl } from "@angular/forms";

interface CustomValidationResult {
    [key: string]: boolean;
}

export class CustomValidator {    
    static notInteger(control: FormControl): CustomValidationResult {

        if (control.value != null && control.value != undefined && control.value != "") {
            if (isNaN(control.value))
                return { "notInteger": true };

            let val = parseFloat(control.value);
            if (Math.round(val) != val)
                return { "notInteger": true };
        }

        return null;
    }
}