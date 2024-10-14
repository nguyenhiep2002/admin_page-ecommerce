import { Component, Inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core'
import * as _ from 'underscore';
import { StringUtils } from '@aratech/utils/stringUtils';
import { DeviceTestCodeService } from '../services/deviceTestCode.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WestGardRuleChecker } from 'app/common/westgard-rules/rule-checker';

@Component({
    selector: 'add-rule',
    templateUrl: './add-rule.component.html',
    styleUrls: ['./add-rule.component.scss'],
    providers: [TranslatePipe],
})
export class AddRuleComponent implements OnInit {
    dayNumber: number = 30;
    listRules = WestGardRuleChecker.getListRulesInfo();
    listRulesGroup: any[];
    rulesConfig: any = {};
    listRulesGroupLeft: any = {};
    listRulesGroupRight: any = {};

    constructor(
        public snackBar: MatSnackBar,
        private translate: TranslatePipe,
        public dialogRef: MatDialogRef<AddRuleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public deviceTestCodeService: DeviceTestCodeService
    ) {
        if(StringUtils.isNullOrEmpty(data.item.deviceTestCodeRule))
        {
            this.listRules.forEach(r => {
                this.rulesConfig[r.name] = r.errorLevel;
            });
        }
        else {
            let deviceTestCodeRule = JSON.parse(data.item.deviceTestCodeRule);
            this.rulesConfig = deviceTestCodeRule;
            this.dayNumber = deviceTestCodeRule.SoNgay;
        }

        this.listRulesGroup = _.pairs(_.groupBy(this.listRules, x => x.errorGroup)).map(x => {
            return {
                errorGroup: x[0],
                groupLabel: x[0] == '1' ? 'QcChart.BasicRule' : 'QcChart.AdvanceRule',
                rules: x[1]
            };
        });
        this.listRulesGroupLeft = this.listRulesGroup[0];
        this.listRulesGroupRight = this.listRulesGroup[1];
    }

    ngOnInit() {

    }
    cancel(): void {
        this.dialogRef.close();
    }

    changeAllRulesConfig(value, group) {
        this.listRules.forEach(r => {
            if (r.errorGroup == group)
                this.rulesConfig[r.name] = parseInt(value);
        });
    }

    saveRuleConfig() {
        let rules = Object.assign({}, this.rulesConfig);
        let item = Object.assign({}, this.data.item);
        if (!StringUtils.isNullOrEmpty(this.dayNumber)) {
            rules.SoNgay = +this.dayNumber;
            if(rules.SoNgay > 100) {
                this.snackBar.open(this.translate.transform('Hãy nhập số ngày lấy kết quả nhỏ hơn 100'), 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                return;
            }
        }
        else {
            this.snackBar.open(this.translate.transform('Bạn vui lòng chọn số ngày lấy kết quả'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
            return;
        }
        item.deviceTestCodeRule = JSON.stringify(rules);
        item.standardTest = undefined
        this.deviceTestCodeService.put(item, item.id).then(res => {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateSuccess'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
            let data = {
                res: res,
            }
            this.dialogRef.close(data);
        },
            err => {
                this.snackBar.open(this.translate.transform('Common.Msg.UpdateError'), 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            });
    }
}
