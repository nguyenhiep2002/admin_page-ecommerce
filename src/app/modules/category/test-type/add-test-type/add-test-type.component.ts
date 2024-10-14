import { Component, Inject } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslatePipe } from '@ngx-translate/core'
import { TestTypeService } from '../../services/testType.service'
import { AraValidators } from '../../../../../@aratech/utils/validators'

@Component({
    selector: 'app-add-test-type',
    templateUrl: './add-test-type.component.html',
    styleUrls: ['./add-test-type.component.scss']
})
export class AddTestTypeComponent {
    form: FormGroup
    item: any = {}

    constructor(
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private translate: TranslatePipe,
        public dialogRef: MatDialogRef<AddTestTypeComponent>,
        public testTypeService: TestTypeService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog
    ) {

    }

    ngOnInit(): void {
        this.dialogRef.keydownEvents().subscribe(event => {
            if (event.key === 'Escape') {
                this.dialogRef.close()
                return
            }
        })
        const item = { ...this.data?.item }
        if(this.data.isCopy) {
            delete item.id
            delete item.code
        }
        this.item = item
        this.form = this.formBuilder.group({
            code: [item?.code,
                [Validators.minLength(1), Validators.required],
                [AraValidators.checkCodeExistsAsync(this.testTypeService, this.data.idCustomer, this.data?.item?.code)]
            ],
            name: [item?.name, [Validators.minLength(1), Validators.required]],
            desc: [item?.desc, []]
        })

    }

    async onSave() {
        const body = {
            ...(this.data.isEdit && { id: this.item.id }),
            customerId: this.data.idCustomer,
            name: this.item.name,
            code: this.item.code,
            desc: this.item.desc,
            test:this.item.test
        }
        console.log(body);
        
        // if (this.data.isCopy) delete body.id
        // if (this.data.isEdit) {
        //     await this.testTypeService
        //         .put(body, body.id)
        //         .then((rs) => this.messageResponse(rs))
        //         .catch(() => this.messageResponse(false))
        // } else {
        //     await this.testTypeService.post(body)
        //         .then((rs) => this.messageResponse(rs))
        //         .catch(() => this.messageResponse(false))
        // }
    }

    messageResponse(res: any, isClose: boolean = true) {
        const msg = res
            ? this.translate.transform('Common.Msg.UpdateSuccess')
            : this.translate.transform('Common.Msg.UpdateError')
        this.snackBar.open(msg, 'OK', {
            verticalPosition: 'top',
            duration: 2000
        })
        if (isClose) this.dialogRef.close(res)
    }
    onchangetest(event:any){
        console.log(event);
        
        this.form.get('test').setValue(event.value, { emitEvent: false });
    }
}
