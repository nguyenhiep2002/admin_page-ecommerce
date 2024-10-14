import { Component, OnInit, Inject, Type, Injector } from '@angular/core';
import { CategoryConfig } from '../../models/categoryConfig';
import { ICategoryConfigService } from '../../services/ara-category.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ControlType } from '../../enums/controlType';
import { BaseService } from '@aratech/services/base.service';
import { Configs } from '@aratech/utils/configs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

export class QuickSearchConfig {
    options?: any;
    params?: any;
    item?: any;
    title?: string;
    subTitle?: string;
    width?: string;
    minWidth?: string;
    filterControlColumns?: number;
    service?: Type<BaseService<any> & ICategoryConfigService>;
    resolve?: (selectedItem, fowardParams) => Promise<any>;
    getSubTitle?: (fowardParams) => string;
}

@Component({
    selector: 'ara-quick-search',
    templateUrl: './ara-quick-search.component.html',
    styleUrls: ['./ara-quick-search.component.scss'],
    providers: [TranslatePipe],
    animations: fuseAnimations
})
export class AraQuickSearchComponent implements OnInit {
    itemDetail: any = {};
    searchText = '';
    service: BaseService<any> & ICategoryConfigService;
    displayedColumns: any[] = [];
    filterControls: any[] = [];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    length: number = 0;
    pageIndex: number = 0;
    pageSize: number = Configs.getConfig('Paging_Size');
    pageSizeOptions = Configs.getConfig('Paging_SizeOptions');
    configs: CategoryConfig;
    defaultParams: any;
    fowardParams: any;
    resolveFunction: (selectedItem, fowardParams) => Promise<any>;
    options: QuickSearchConfig;
    selectedItem: any;
    subTitle: any;

    constructor(public snackBar: MatSnackBar,
        private translate: TranslatePipe,
        public dialogRef: MatDialogRef<AraQuickSearchComponent>,
        private injector: Injector,
        @Inject(MAT_DIALOG_DATA) public data: QuickSearchConfig) {

        this.options = data;
        this.defaultParams = data.params ? data.params : {};
        this.fowardParams = data.item;
        this.service = this.injector.get(data.service);      
        this.resolveFunction = data.resolve;
        this.initSubTitle();
        this.service.getCategoryConfig().then(cfg => {
            this.configs = cfg;
            let displayedColumns = this.configs.fields.filter(x => x.showInGrid).map(x => x.name);
            displayedColumns.unshift('id');
            displayedColumns.unshift('hiddenFirst');
            this.displayedColumns = displayedColumns;            
            this.fetch();
        });
    }

    ngOnInit() {
    }

    fetch() {
        let params = Object.assign({}, this.defaultParams);
        params.search = this.searchText;
        // params.type = this.configs.type;

        // if (this.configs.expandFields)
        //     params['expand'] = this.configs.expandFields

        if (this.configs.noPaging) {
            this.pageSize = 9999;
            this.pageIndex = 0;
        }

        this.service.get(params, this.pageIndex + 1, this.pageSize).then(rs => {
            this.length = rs.totalCount;
            this.dataSource.data = rs.data;
        });
    }

    search(keyCode: Number) {
        if (keyCode == 13) {
            this.pageIndex = 0;
            this.fetch();
        }
    }

    pageEvent(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.fetch();
    }

    rowClick(item: any) {
        this.selectedItem = item;
    }

    select() {
        if (this.resolveFunction) {
            this.resolveFunction(this.selectedItem, this.fowardParams).then(() => {
                this.processResponse(true);
            }).catch(() => {
                this.processResponse(false);
            });
        }
    }

    cancel()
    {
        this.dialogRef.close();
    }

    processResponse(res) {
        if (res) {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateSuccess'), 'OK', {
                verticalPosition: 'top',
                duration        : 2000
            });
            this.dialogRef.close(res);
        }        
        else {
            this.snackBar.open(this.translate.transform('Common.Msg.UpdateError'), 'OK', {
                verticalPosition: 'top',
                duration        : 2000
            });
        }
    }

    initSubTitle() {
        if (this.options.getSubTitle) {
            this.subTitle = this.options.getSubTitle(this.fowardParams);
        }

        if (!this.subTitle && this.options.subTitle)
            this.subTitle = this.options.subTitle;
    }

    generateFilterControl() {
        this.configs.fields.forEach(field => {
            if (field.allowFilter) {
                if (field.type == ControlType.Combobox) {
                    
                }
            }
        });
    }
}
