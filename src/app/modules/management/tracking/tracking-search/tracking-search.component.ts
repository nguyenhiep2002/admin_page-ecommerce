import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import moment from 'moment'
import { GlobalStoreService } from '../../../../core/store/global-store.service'
import { DeviceService } from '../../../category/services/device.service'
import { DeviceTestCodeService } from '../../../category/services/deviceTestCode.service'
import { StringUtils } from '../../../../../@aratech/utils/stringUtils'
import { FormControlUtils } from '../../../../../@aratech/utils/formControlUtils'
import { Configs } from '../../../../../@aratech/utils/configs'

@Component({
  selector: 'tracking-search',
  templateUrl: './tracking-search.component.html',
  styleUrls: ['./tracking-search.component.scss'],
  providers: [DeviceService, DeviceTestCodeService]
})
export class TrackingSearchComponent implements OnInit {
  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>()
  formGroup: FormGroup
  itemsTrackingType: any[] = Configs.getConfig('TrackingType') ?? []
  itemsStatus: any[] = [
    {
      id: 1,
      name: 'Thành công'
    },
    {
      id: 2,
      name: 'Lỗi'
    },
    {
      id: 3,
      name: 'Cảnh báo'
    }
  ]
  itemsDevices: any[] = []

  //Auth
  customerId: string = ''
  isUser: boolean = false

  constructor(private globalStoreService: GlobalStoreService, private devicesServices: DeviceService) {}

  getDisplayByStatus(status: number, field: string) {
    const item = this.itemsTrackingType?.find((x) => x?.id === status)
    if (!item) return ''
    if (field === 'bgColor') return `background-color: ${item['bgColor']};`
    if (field === 'textColor') return `color: ${item['textColor']};`
    return item[field]
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = new FormGroup({
      dateTracking: new FormControl(moment().clone(), [Validators.required]),
      timeStart: new FormControl(moment().clone().startOf('day').format('HH:mm:ss'), [Validators.required]),
      timeEnd: new FormControl(moment().clone().endOf('day').format('HH:mm:ss'), [Validators.required]),
      deviceId: new FormControl(''),
      sid: new FormControl(''),
      status: new FormControl(''),
      trackingType: new FormControl('')
    })
    //Xử lý lấy Global Customer ID
    //1. Nếu đã chọn Customer thì getData từ globalStoreService
    this.customerId = this.globalStoreService.getData()?.customerId
    if (this.customerId) {
      this.isUser = true
      await this.fetchDevices()
      FormControlUtils.disableAllControl(this.formGroup, false)
    } else {
      FormControlUtils.disableAllControl(this.formGroup)
    }
    //2. Nếu người dụng thực hiện chọn Customer mới ở tại Component này thì subscribe event để hứng event thay đổi Customer
    this.globalStoreService.getEvent().subscribe(async (data) => {
      this.isUser = !!data.customerId
      if (!data.customerId) {
        FormControlUtils.disableAllControl(this.formGroup)
        return
      }
      this.customerId = data.customerId
      FormControlUtils.disableAllControl(this.formGroup, false)
      await this.fetchDevices()
    })
  }

  onSubmit(data: any) {
    const startDate = data.dateTracking.clone().set({
      hour: +data.timeStart.split(':')[0],
      minute: +data.timeStart.split(':')[1],
      second: +data.timeStart.split(':')[2]
    })
    const endDate = data.dateTracking.clone().set({
      hour: +data.timeEnd.split(':')[0],
      minute: +data.timeEnd.split(':')[1],
      second: +data.timeEnd.split(':')[2]
    })
    const params = {
      deviceId: data.deviceId,
      sid: data.sid,
      status: data.status,
      trackingType: data.trackingType,
      dateTrackingParams: `(${startDate.toISOString()},${endDate.toISOString()})`,
      dateTrackingStart: startDate.toISOString(),
      dateTrackingEnd: endDate.toISOString()
    }
    this.onSearch.emit(params)
  }

  fetchDevices = async () => {
    if (!this.customerId) return
    await this.devicesServices
      .getAsync({ customerId: this.customerId }, 1, 999, { name: 'desc' })
      .then((response) => (this.itemsDevices = response?.data))
      .catch((error) => console.log(error))
  }
}
