import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
// service lưu trữ trạng thái (subscription)
export class StoreCustomerService {
  constructor() {}

  private dataSubject = new BehaviorSubject<any>(null)
  private customerState = new BehaviorSubject<any>(null)
  private siteState = new BehaviorSubject<any>(null)
  private nodeState = new BehaviorSubject<any>(null)
  private deviceState = new BehaviorSubject<any>(null)
  private deviceMove = new BehaviorSubject<any>(null)

  // method
  sendData = (data: any) => this.dataSubject.next(data)
  getData = this.dataSubject.asObservable()

  setStateCustomer = (data: any) => this.customerState.next(data)
  getStateCustomer = this.customerState.asObservable()

  setStateSite = (data: any) => this.siteState.next(data)
  getStateSite = this.siteState.asObservable()

  setStateNode = (data: any) => this.nodeState.next(data)
  getStateNode = this.nodeState.asObservable()

  setStateDevice = (data: any) => this.deviceState.next(data)
  getStateDevice = this.deviceState.asObservable()

  setDeviceMove = (data?: any) => this.deviceMove.next(data)
  getDeviceMove = this.deviceMove.asObservable()
}
