import { Component, OnInit, Input, Inject, Injector } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ControlType } from '../../enums/controlType';
import * as moment from "moment";
import { CategoryConfig } from '../../models/categoryConfig';
import { BaseService } from '@aratech/services/base.service';
import { StringUtils } from '@aratech/utils/stringUtils';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'ara-form',
    templateUrl: './ara-form.component.html',
    styleUrls: ['./ara-form.component.scss'],
    providers: [TranslatePipe]
})
export class AraFormComponent implements OnInit {
    service: BaseService<any>;
    options: any = {};
    fields: any[] = [];
    categoryConfig: CategoryConfig;
    objectFields: string[];
    item: any;
    oldItem: any;
    form: FormGroup;
    formErrors: any;
    isEdit: boolean;

    constructor(public snackBar: MatSnackBar,
        private translate: TranslatePipe,
        public dialogRef: MatDialogRef<AraFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        public injector: Injector) 
    {
        this.service = data.service;
        this.categoryConfig = data.categoryConfig;
        this.options = data.options;
        this.fields = data.fields.filter(x => x.type != ControlType.RefInfo);
        this.isEdit = data.isEdit;
        this.item = Object.assign({}, data.item);
        this.oldItem = this.isEdit ? Object.assign({}, data.item) : {};
        this.formErrors = {};
        this.objectFields = data.objectFields ? data.objectFields : [];
        this.fields.forEach(field => {
            this.formErrors[field.name] = {};
        });

    }

    ngOnInit() {
        var controls = {};
        var isFirstElementInRow = true;
        this.fields.forEach((field, index) => {
            isFirstElementInRow = this.checkNeedBreakLine(field, isFirstElementInRow);
            field.isEdit = this.isEdit;
            if (field.getReferenceServiceParams) {
                var refParams = field.getReferenceServiceParams(this.item);
                if (!field.referenceServiceParams)
                    field.referenceServiceParams = {};
                Object.assign(field.referenceServiceParams, refParams);
            }
            this.setDefaultValue(field);
            this.generateTabIndex(field, index);
            this.generateValidators(field, this.item);
            var control = new FormControl({value: this.item[field.name], disabled: field.disableValue }, field.validatorFn, field.asyncValidatorFn);
            controls[field.name] = control;
        });

        this.form = this.formBuilder.group(controls);
        // this.form.valueChanges.subscribe(() => {
        //     this.onFormValuesChanged();
        // });
    }

    onFormValuesChanged()
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if (control && control.dirty && !control.valid && !control.pending)
            {
                this.formErrors[field] = control.errors;
            }
        }
    }

    cancel(): void
    {
        this.dialogRef.close();
    }

    processResponse(res, action) {
        if (res) {
            this.snackBar.open(this.translate.transform(`Common.Msg.${action}Success`), 'OK', {
                verticalPosition: 'top',
                duration        : 2000
            });
            this.dialogRef.close({responseData: res, model: this.item});
        }        
        else {
            this.snackBar.open(this.translate.transform(`Common.Msg.${action}Error`), 'OK', {
                verticalPosition: 'top',
                duration        : 2000
            });
        }
    }

    async save() {
        var asyncProcessBefore = this.fields
            .filter(f => f.type == ControlType.Dynamic && f['beforeSaveAsync']);
        
        if (asyncProcessBefore.length > 0) {
            await Promise.all(asyncProcessBefore.map(f => f['beforeSaveAsync'](this.item[f.name + '_instance'], this.item)));
        }

        if (this.categoryConfig && this.categoryConfig.beforeSave) {
            this.categoryConfig.beforeSave(this.item);
        }
        let item = Object.assign({}, this.item);

        for(var propertyName in item) {
            if (typeof(item[propertyName]) == 'object' 
                && this.objectFields.indexOf(propertyName) < 0
                && !(item[propertyName] instanceof moment)
            )
                item[propertyName] = undefined;
        }

        if (this.isEdit) {
            this.service.put(item, item.id).then((res) => {
                this.processResponse(res, 'Update');
            },
            () => {
                this.processResponse(false, 'Update');
            });
        }
        else {
            this.service.post(item).then((res) => {
                this.item.id = res.id;
                this.processResponse(res, 'Add');
            },
            () => {
                this.processResponse(false, 'Add');
            });
        }
    }

    checkNeedBreakLine(field: any, isFirstElement: boolean): boolean {
        if (field.merge) {
            if (isFirstElement && !field.fitRowWidth) {
                field.addSpace = field.mergeEnd ? true : false;
                return field.mergeEnd ? false : true;
            }
            else {
                return field.mergeEnd ? true : false;
            }
        }
        else {
            if (isFirstElement && !field.fitRowWidth) {
                field.addSpace = true;
                return false;
            }
            else {
                return true;
            }
        }
    }

    setDefaultValue(field: any) {
        if (!this.isEdit && field.defaultValue) {
            this.item[field.name] = field.defaultValue;
        }
    }

    generateTabIndex(field: any, index: number) {
        if (typeof(field.tabIndex) !== 'number') {
            field.tabIndex = index + 1;
        }
    }

    generateValidators(field: any, item: any) {
        let validators = [];
        let asyncValidators = [];
        let errors = [];
        field.disableValue = false;

        if (field.disabled) {
            field.disableValue = field.disabled(item);
        }

        if (field.required) {
            validators.push(Validators.required);
            errors.push({
                name: 'required',
                message: StringUtils.format(this.translate.transform('Category.Msg.Required'), this.translate.transform(field.title))
            });
        }

        if (field.minLength) {
            validators.push(Validators.minLength(field.minLength));
            errors.push({
                name: 'minlength',
                message: StringUtils.format(this.translate.transform('Category.Msg.MinLength'), this.translate.transform(field.title), field.minLength)
            });
        }

        if (field.maxLength) {
            validators.push(Validators.maxLength(field.maxLength));
            errors.push({
                name: 'maxlength',
                message: StringUtils.format(this.translate.transform('Category.Msg.MaxLength'), this.translate.transform(field.title), field.maxLength)
            });
        }

        if (typeof(field.min) !== 'number') {
            validators.push(Validators.min(field.min));
            errors.push({
                name: 'min',
                message: StringUtils.format(this.translate.transform('Category.Msg.Min'), this.translate.transform(field.title), field.min)
            });
        }

        if (typeof(field.max) !== 'number') {
            validators.push(Validators.max(field.max));
            errors.push({
                name: 'max',
                message: StringUtils.format(this.translate.transform('Category.Msg.Max'), this.translate.transform(field.title), field.max)
            });
        }

        if (field.existsValidators) {
            let fieldExistsValidator: AsyncValidatorFn = field.existsValidators(this);
            asyncValidators.push(fieldExistsValidator);
            errors.push({
                name: 'exists',
                message: StringUtils.format(this.translate.transform('Category.Msg.Exists'), this.translate.transform(field.title))
            });
        }

        if (field.validators) {
            let fieldValidator: any = field.validators(this);
            for(var validator of fieldValidator) {
                validators.push(validator.validatorFn);
                errors.push({
                    name: validator.name,
                    message: this.translate.transform(validator.message)
                });
            }
        }

        if (field.asyncValidators) {
            let fieldAsyncValidators: any[] = field.asyncValidators(this);
            for(var validator of fieldAsyncValidators) {
                asyncValidators.push(validator.validatorFn);
                errors.push({
                    name: validator.name,
                    message: this.translate.transform(validator.message)
                });
            }
        }
        field.validatorFn = Validators.compose(validators);
        field.asyncValidatorFn = Validators.composeAsync(asyncValidators);
        field.errors = errors;
    }
}
