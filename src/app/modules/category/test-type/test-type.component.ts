import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { LangChangeEvent, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core'
import { TestTypeService } from '../services/testType.service'
import { AddTestTypeComponent } from './add-test-type/add-test-type.component'
import { WorkSpaceService } from 'app/modules/management/service/work-space.service'
import _ from 'lodash'
import { MatSort } from '@angular/material/sort'
import { GlobalStoreService } from '../../../core/store/global-store.service'
import * as XLSX from 'xlsx'
import { UserService } from '../../../core/user/user.service'
import { DeepcareSyncService } from 'app/modules/management/service/deepcare-sync.service'
import { NotificationCustom } from 'app/modules/management/common/notification-custom'
import { Confirm } from 'app/modules/management/common/confirmPopup'

@Component({
    selector: 'app-test-type',
    templateUrl: './test-type.component.html',
    styleUrls: ['./test-type.component.scss'],
    providers: [TranslateModule, TranslatePipe, TestTypeService],
})
export class TestTypeComponent implements OnInit {
    roleUser: string = localStorage.getItem('current_role')
    isAdmin = this.roleUser === 'Admin'
    displayedColumns: string[] = ['checkbox', 'id', 'code', 'name', 'description', 'createdAt']
    params: any = {}
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
    totalCount: number = 0
    pageIndex: number = 0
    pageSize: number = 10
    pageSizeOptions = [5, 10, 25, 100]
    item: any = {}
    isLoading: boolean = false
    selectedItem: any = {}
    showAddButton: boolean = false
    idCustomer: string
    customerCode: any = {}
    dataSourceCopy: any[]
    dataSearch: any[]
    selectedRows: any[] = []
    userInfo: any = {}
    isAnyRowSelected: boolean = false

    @ViewChild(MatSort, { static: true }) order: MatSort
    @ViewChild(MatPaginator) paginator: MatPaginator

    constructor(
        public snackBar: MatSnackBar,
        private translate: TranslatePipe,
        public testTypeService: TestTypeService,
        private notification: NotificationCustom,
        public dialog: MatDialog,
        public workSpace: WorkSpaceService,
        public userService: UserService,
        private synData: DeepcareSyncService,
        private confirm: Confirm,
        private _fuseConfirmationService: FuseConfirmationService,
        private globalStoreService: GlobalStoreService,
        private translateService: TranslateService,
    ) {
        this.userInfo = userService.user
        if (this.userInfo.userName === 'rootadmin') {
            this.displayedColumns.push('actions')
        }
    }

    async ngOnInit(): Promise<void> {
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.globalStoreService.setTitle(event.translations.TestType.Title)
        });
        this.globalStoreService.setTitle(this.translate.transform('TestType.Title'))
        this.order.sortChange.subscribe(() => {
            this.arrange(this.order.active ?? '', this.order?.direction ?? '')
        })
        // //Xử lý lấy Global Customer ID
        // //1. Nếu đã chọn Customer thì getData từ globalStoreService
        // if (this.globalStoreService.getData()?.customerId) {
        //     await this.onChangeCustomer(this.globalStoreService.getData()?.customerId)
        //     this.customerCode = this.globalStoreService.getData()?.customerCode
        // }
        // //2. Nếu người dụng thực hiện chọn Customer mới ở tại Component này thì subscribe event để hứng event thay đổi Customer
        // this.globalStoreService.getEvent().subscribe(async (data) => {
        //     if (!data.customerId) {
        //         this.showAddButton = false
        //         this.dataSource.data = []
        //         return
        //     }
        //     this.customerCode = data.customerCode
        //     await this.onChangeCustomer(data.customerId)
        // })
        this.onChangeCustomer('343fbd81-41a7-406f-8138-b529d2d7aad0')


    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator
    }

    async fetch(idCustomer?: any): Promise<void> {
        this.params.customerId = idCustomer
        idCustomer
            ? await this.testTypeService.getAsync(this.params, 1, 9999, { createdAt: 'desc' }).then((rs) => {
                this.totalCount = rs.totalCount
                this.dataSource.data = rs?.data?.map((x, index) => {
                    x.position = this.pageIndex * this.pageSize + index + 1
                    return x
                })
                this.dataSourceCopy = this.dataSource.data
                this.dataSearch = rs.data
            })
            : (this.dataSource.data = [])
    }

    search(event: any) {
        if (!this.idCustomer) return
        let value = (event.target.value ?? '').trim().toLowerCase()
        this.dataSource.data = this.dataSearch
            .filter((f) =>
                f.name.toLowerCase().includes(value) ||
                f.code.toLowerCase().includes(value)
            )
            .map((obj, index) => ({
                ...obj,
                position: index + 1
            }))

    }

    copy(item: any) {
        delete item.id
        item.files = []
        this.selectedItem = item
        let dialogRef = this.dialog.open(AddTestTypeComponent, {
            minWidth: '40%',
            height: '100%',
            position: {
                right: '0'
            },
            panelClass: 'mat-mdc-dialog-container-right',
            data: {
                title: 'TestType.CopyTitle',
                item: this.selectedItem,
                idCustomer: this.idCustomer,
                isCopy: true
            }
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.fetch(this.idCustomer)
            }
        })
    }

    edit(item: any) {
        this.selectedItem = item
        let dialogRef = this.dialog.open(AddTestTypeComponent, {
            minWidth: '40%',
            height: '100%',
            position: {
                right: '0'
            },
            panelClass: 'mat-mdc-dialog-container-right',
            data: {
                title: 'TestType.EditTitle',
                item: this.selectedItem,
                idCustomer: this.idCustomer,
                isEdit: true
            }
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.fetch(this.idCustomer)
            }
        })
    }

    add() {
        let dialogRef = this.dialog.open(AddTestTypeComponent, {
            minWidth: '40%',
            height: '100%',
            position: {
                right: '0'
            },
            panelClass: 'mat-mdc-dialog-container-right',
            data: {
                title: 'TestType.AddTitle',
                idCustomer: this.idCustomer,
                isEdit: false
            }
        })
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.fetch(this.idCustomer)
            }
        })
    }

    async syncService(customerCode) {
        let propsSync = {
            title: this.translate.transform('Client.SyncTitle'),
            message: this.translate.transform('Client.MsgForm.Sync').replace("{0}", customerCode)
        }
        const handleSync = async () =>
            await this.synData
                .syncTestListRetrieval(customerCode)
                .then((rs) => {
                    this.notification.success(rs?.message)
                })
                .catch((er) => this.notification.error(er?.error?.message || this.translate.transform('Client.MsgForm.SyncFail')))
                .finally(() => {
                    this.fetch(this.idCustomer)
                })
        this.confirm.success(propsSync, handleSync)
    }

    processResponse(res, mess?) {
        if (res) {
            this.snackBar.open(this.translate.transform(mess ? mess : 'Common.Msg.UpdateSuccess'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            })
            this.ngOnInit()
        } else {
            this.snackBar.open(this.translate.transform(mess ? mess : 'Common.Msg.UpdateError'), 'OK', {
                verticalPosition: 'top',
                duration: 2000
            })
        }
    }

    async delete(item: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: this.translate.transform('TestType.DeleteTitle'),
            message: this.translate.transform('TestType.DeleteMessage'),
            actions: {
                confirm: {
                    label: this.translate.transform('Common.Confirm')
                },
                cancel: {
                    label: this.translate.transform('TestType.Cancel'),
                }
            }
        })

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.testTypeService.delete(item.id).then(
                    (rs) => {
                        this.processResponse(true, 'Common.Msg.DeleteSuccess')
                    },
                    (err) => {
                        if (err.message == 'Using') {
                            this.processResponse(false, 'Common.Msg.DeleteErrorUsing')
                        } else {
                            this.processResponse(false, 'Common.Msg.DeleteError')
                        }
                    }
                )
            }
        })
    }

    async onChangeCustomer(idCustomer) {
        console.log(idCustomer);
        
        this.showAddButton = !!idCustomer
        this.idCustomer = idCustomer
        if (!idCustomer) this.params.search = undefined

        this.params.order = this.order.direction === 'asc'
            ? this.order.active
            : !_.isEmpty(this.order.active) ? `${this.order.active}|desc` : ''
        await this.fetch(idCustomer)
    }

    arrange(name: string, value: string) {
        const compareFunction = (a, b) => {
            const compareResult = a[name].localeCompare(b[name])
            return value === 'asc' ? compareResult : -compareResult
        }

        if (name && value) {
            this.dataSource.data = this.dataSource.data
                .sort(compareFunction)
                .map((obj, index) => ({
                    ...obj,
                    position: index + 1
                }))
        }
    }

    // selectAll(event: MatCheckboxChange) {
    //     const checked = event.checked
    //     // Xử lý logic khi checkbox chọn hoặc bỏ chọn tất cả
    //     // Ví dụ: cập nhật thuộc tính selected của tất cả các item trong danh sách
    //     this.dataSource.data.forEach((item: any) => {
    //         item.selected = checked
    //     })
    // }

    checkboxChanged(row: any) {
        if (row.selected) {
            this.selectedRows.push(row)
        } else {
            const index = this.selectedRows.findIndex((item) => item === row)
            if (index !== -1) {
                this.selectedRows.splice(index, 1)
            }
        }
        this.isAnyRowSelected = this.selectedRows.length > 0
    }

    exportToExcel(): void {
        let data: any[]

        if (this.isAnyRowSelected) {
            data = this.selectedRows.map((item: any, index: number) => {
                return [
                    index + 1,
                    item.code,
                    item.name,
                    item.desc
                ]
            })
        } else {
            data = this.dataSource.data.map((item: any, index: number) => {
                return [
                    index + 1,
                    item.code,
                    item.name,
                    item.desc
                ]
            })
        }

        const headers: string[] = [
            this.translate.transform('Common.No'),
            this.translate.transform('TestType.Code'),
            this.translate.transform('TestType.Name'),
            this.translate.transform('Common.Description')
        ]
        const dataWithHeaders = [headers, ...data]

        const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders)
        const colWidths = [10, 30, 30]
        worksheet['!cols'] = []
        for (let i = 0; i < colWidths.length; i++) {
            worksheet['!cols'].push({ wch: colWidths[i] })
        }

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tên Worksheet')

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = this.translate.transform('TestType.TitleChild') + '.xlsx',
            a.click()

        URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }
}
