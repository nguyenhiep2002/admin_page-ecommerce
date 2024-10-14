import { FormControl, ValidatorFn } from "@angular/forms";

interface ValidationResult {
    [key: string]: boolean;
}

export class UserValidator {    
    private static strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
    private static usernameRegex = new RegExp("[^a-zA-Z0-9]");

    static hasSpecialChar(control: FormControl): ValidationResult {
        if (control.value != null && control.value != undefined && control.value != "" && UserValidator.usernameRegex.test(control.value)) {
            return { "hasSpecialChar": true };
        }

        return null;
    }

    static startsWithNumber(control: FormControl): ValidationResult {
        if (control.value != null && control.value != undefined && control.value != "" && !isNaN(control.value.charAt(0))) {
            return { "startsWithNumber": true };
        }

        return null;
    }

    static weakPassword(control: FormControl): ValidationResult {
        if (control.value != null && control.value != undefined && control.value != "" 
            && !UserValidator.strongRegex.test(control.value)) {
            return { "weakPassword": true };
        }

        return null;
    }

    static minNumber(min: number, control: FormControl): ValidationResult {
        if (parseInt(control.value, 10) < min) {
            return { "minNumber": true };
        }

        return null;
    }

    static maxNumber(max: number, control: FormControl): ValidationResult {
        if (parseInt(control.value, 10) > max) {
            return { "maxNumber": true };
        }

        return null;
    }

    static mailFormat(control: FormControl): ValidationResult {

        var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (control.value != null && control.value != undefined && control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "mailFormat": true };
        }

        return null;
    }

    static telephoneFormat(control: FormControl): ValidationResult {
        var TELEPHONE_REGEXP = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
        var PHONE_REGEXP = /(84|0[2])+([0-9]{9,11})\b/g;
        var value = control.value ? control.value.replaceAll(" ", "").replaceAll(".", "") : '';
        if (value && (!TELEPHONE_REGEXP.test(value) && !PHONE_REGEXP.test(value))) {
            return { "telephoneFormat": true };
        }

        return null;
    }

    static comparisonValidator(compareControl: FormControl): ValidatorFn {
        return (control: FormControl): ValidationResult => {
            if (control.value !== compareControl.value) {
                return { "comparisonValidator": true };
            }
            return null;
        };
    }

    static notEqualsTo(compareControl: FormControl): ValidatorFn {
        return (control: FormControl): ValidationResult => {
            if (control.value === compareControl.value) {
                return { "notEqualsTo": true };
            }
            return null;
        };
    }
}