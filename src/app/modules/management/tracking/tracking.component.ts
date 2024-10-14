import { Component, OnInit } from '@angular/core'
import { GlobalStoreService } from '../../../core/store/global-store.service'
import { MatDialog } from '@angular/material/dialog'
import { TrackingDialogComponent } from './tracking-dialog/tracking-dialog.component'
import { Configs } from '../../../../@aratech/utils/configs'

const ELEMENT_DATA: any[] = [
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 2,
    deviceName: 'Hydrogen 1',
    sid: '1999',
    desc: 'Thông tin thêm',
    stateStatus: 2,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 3,
    deviceName: 'Hydrogen 2',
    sid: '1999',
    desc: 'Thông tin thêm',
    stateStatus: 3,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen 3',
    sid: '1999',
    desc: 'Thông tin thêm',
    stateStatus: 4,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 2,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 2,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 3,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 2,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 3,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  },
  {
    statusEvent: 1,
    deviceName: 'Hydrogen',
    sid: '1981',
    desc: 'Thông tin thêm',
    stateStatus: 1,
    date: '2024-01-08T06:25:06.378725Z'
  }
]

@Component({
  selector: 'tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  displayedColumns: string[] = ['statusEvent', 'deviceSid', 'dateTracking', 'stateStatus', 'desc', 'action']
  itemsStatus: any[] = Configs.getConfig('TrackingType') ?? []
  dataSource = ELEMENT_DATA
  paramSearch: any = {}
  pagination: any = {
    totalCount: this.dataSource.length,
    pageIndex: 0,
    pageSize: 10,
    pageSizeOptions: Configs.getConfig('Paging_SizeOptions')
  }

  getDisplayByStatus(status: number, field: string) {
    const item = this.itemsStatus?.find((x) => x?.id === status)
    if (!item) return ''
    if (field === 'bgColor') return `background-color: ${item['bgColor']};`
    if (field === 'textColor') return `color: ${item['textColor']};`
    return item[field]
  }

  constructor(private globalStoreService: GlobalStoreService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.globalStoreService.setTitle('Theo dõi tiến trình')
  }

  onChangePage(event: any) {
    this.pagination.pageSize = event.pageSize
    this.pagination.pageIndex = event.pageIndex
    console.log('onChangePage', event)
  }

  onViewRaw(item: any) {
    const dialogRef = this.dialog.open(TrackingDialogComponent, {
      panelClass: 'child-no-padding',
      data: {
        title: 'Dữ liệu thô của sự kiện',
        rawData: item
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.onSearch(this.paramSearch)
    })
  }

  onSearch(params: any) {
    this.paramSearch = params
    console.log('onSearch', params)
  }
}
