import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core'
import { ComponentDataService } from 'app/shared/services/componentData.service'
import { MatDialog } from '@angular/material/dialog'
import { UploadFileService } from '@aratech/services/uploadFile.service'
import { ViewFileService } from '@aratech/services/view-file.service'
import { TranslatePipe } from '@ngx-translate/core'
import { MatTableDataSource } from '@angular/material/table'
import { BaseFieldConfig } from '@aratech/models/baseFieldConfig'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'multi-image',
  templateUrl: './multi-image.component.html',
  styleUrls: ['./multi-image.component.scss'],
  providers: [TranslatePipe]
})
export class MultiImageComponent implements OnInit, OnChanges {
  @Input() filename: string
  @Input() addButtonTitle: string
  @Input() accept: string
  @Input() label: string
  @Input() layout: string
  @Input() value: any[]
  @Input() customFields: BaseFieldConfig[] = []
  @Input() required: boolean = false
  @Input() allowDuplicate: boolean = false
  @Input() copyFile: boolean = true
  @Input() id: string
  @Output() dataFile: EventEmitter<any> = new EventEmitter()

  @Output() valueChange: EventEmitter<any> = new EventEmitter()
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef

  files: any[] = []
  fileList: FileList
  edited: boolean = false
  layoutTmp: string = 'row'
  dataSource = new MatTableDataSource([])
  displayedColumns: any[] = []
  constructor(
    public uploadFileService: UploadFileService,
    public viewFileService: ViewFileService,
    public componentDataService: ComponentDataService,
    public snackBar: MatSnackBar,
    private translate: TranslatePipe,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    let displayedColumns = this.customFields.filter((x) => x.showInGrid).map((x) => x.name)
    displayedColumns.unshift('name')
    displayedColumns.unshift('id')
    displayedColumns.unshift('hiddenFirst')
    displayedColumns.push('actions')
    displayedColumns.push('hiddenLast')
    this.displayedColumns = displayedColumns

    if (this.layout) this.layoutTmp = this.layout

    this.files = (this.value ? this.value : []).map((x) => {
      x.thumb = this.viewFileService.getUrlImageById(x.id)
      x.extension = this.getFileExtension(x.name)
      return x
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.files = (this.value ? this.value : []).map((x) => {
        x.thumb = this.viewFileService.getUrlImageById(x.id)
        x.extension = this.getFileExtension(x.name)
        return x
      })
      this.dataSource.data = this.files
    }
  }

  cancel() {
    this.files = (this.value ? this.value : []).map((x) => {
      x.extension = this.getFileExtension(x.name)
      return x
    })
  }

  clear(file: any) {
    const index = this.files.indexOf(file)
    if (index > -1) {
      this.files.splice(index, 1)
      // this.value = this.files.map(x => {
      //     let item = this.updateFileItem({ id: x.id, name: x.name }, x);
      //     return item;
      // });
      this.dataSource.data = this.files
      this.valueChange.emit(this.value)
      this.dataFile.emit(this.files)

      this.fileInput.nativeElement.value = ''
    }
  }

  chooseFile() {
    this.fileInput.nativeElement.click()
  }

  fileChange(event) {
    var fileList: FileList = event.target.files

    if (fileList.length > 0) {
      Array.from(fileList).forEach((f) => {
        if (!this.allowDuplicate) {
          var exists = this.files.find((o) => o.name == f.name)
          if (exists) {
            this.snackBar.open(this.translate.transform(`Common.Msg.File.DuplicateFilename`), 'OK', {
              verticalPosition: 'top',
              duration: 2000
            })
            return
          }
        }
        let filename = this.checkDuplicateFilename(f.name, 1)
        this.files.push({
          name: filename,
          extension: this.getFileExtension(filename),
          fileData: f,
          size: f.size
        })
        this.dataSource.data = this.files.map((x) => {
          if (x.fileData) {
            this.getImageBase64(x?.fileData, function (base64URL) {
              x.thumb = base64URL
            })
          }
          return x
        })
      })
      this.dataFile.emit(this.files)
    }
  }
  getImageBase64(file, callback) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      var base64URL = reader.result
      callback(base64URL)
    }
    reader.onerror = function (error) {
      console.error('Error: ', error)
    }
  }

  checkDuplicateFilename(filename: string, index: number, realFilename?: string): string {
    if (!realFilename) realFilename = filename
    let hasDuplicate = this.files.filter((f) => f.name == filename).length > 0
    if (!hasDuplicate) return filename

    let arrFilename = realFilename.split('.')
    arrFilename[arrFilename.length - 1] = '.' + arrFilename[arrFilename.length - 1]
    arrFilename.splice(arrFilename.length - 1, 0, ` (${index})`)
    let newFilename = arrFilename.join('')
    return this.checkDuplicateFilename(newFilename, index + 1, realFilename)
  }

  async uploadFiles(): Promise<any[]> {
    try {
      let uploadedFiles = []
      let newFiles = []
      let totalSize = 0
      this.files.forEach((f) => {
        if (f.id) uploadedFiles.push(this.updateFileItem({ id: f.id, name: f.name }, f))
        else {
          totalSize = totalSize + f.size
          newFiles.push(f)
        }
      })

      if (totalSize > 52428800) {
        var newUploaded = await this.uploadMultiRequest(newFiles)
        uploadedFiles.push(...newUploaded)
      } else if (totalSize > 0) {
        var newUploaded = await this.uploadSingleRequest(newFiles)
        uploadedFiles.push(...newUploaded)
      }

      this.files = uploadedFiles
      this.value = this.files
      this.valueChange.emit(this.value)
      this.dataFile.emit(this.value)
      return Promise.resolve(this.files)
    } catch (ex) {
      console.log(ex)
      return Promise.reject()
    }
  }

  async uploadSingleRequest(newFiles: any[]): Promise<any[]> {
    let formData: FormData = new FormData()
    let uploadedFiles = []

    newFiles.forEach((f) => {
      formData.append('files', f.fileData, f.name)
    })

    const rs = await this.uploadFileService.uploadFiles(formData)
    if (rs && rs.uploadedFiles && rs.uploadedFiles.length > 0) {
      rs.uploadedFiles.forEach((uf) => {
        uploadedFiles.push(this.updateFileItem({ id: uf.id, name: uf.filename }, uf))
      })
    }
    return uploadedFiles
  }

  async uploadMultiRequest(newFiles: any[]): Promise<any[]> {
    var uploadPromise: Promise<any>[] = []
    newFiles.forEach((f) => {
      let formData: FormData = new FormData()
      formData.append('files', f.fileData, f.name)
      uploadPromise.push(
        this.uploadFileService.uploadFiles(formData).then((rs) => {
          if (rs && rs.uploadedFiles && rs.uploadedFiles.length > 0) {
            let uf = rs.uploadedFiles[0]
            return this.updateFileItem({ id: uf.id, name: uf.filename }, uf)
          } else {
            return {}
          }
        })
      )
    })

    const uploadedFiles = await Promise.all(uploadPromise)
    return uploadedFiles
  }

  viewFile(file: any) {
    if (file.id) {
      this.viewFileService.getFileStreamById(file.id, this.dialog)
    }
  }

  updateFileItem(item: any, fromItem: any) {
    Array.from(this.customFields).forEach((f: BaseFieldConfig) => {
      item[f.name] = fromItem[f.name]
    })
    return item
  }

  getFileExtension(filename: string) {
    if (!filename) return 'file'

    let arr = filename.split('.')
    let ext = arr[arr.length - 1].toLowerCase()
    let defaultExts = ['pdf', 'xls', 'xlsx', 'doc', 'docx']

    if (defaultExts.indexOf(ext) > -1) return ext
    else return 'file'
  }

  copy(item?: any) {
    let copyData = item ? item : this.files.filter((x) => x.id)
    this.componentDataService.setParams('CopyFileList', copyData)
  }

  paste() {
    var items = this.componentDataService.getParams('CopyFileList', true)
    if (!items || items.length == 0) return

    if (items.length) {
      items.forEach((element) => {
        let exists = this.files.find((o) => o.id == element.id)
        if (exists) return
        this.files.push(element)
      })
    } else {
      var exists = this.files.find((o) => o.id == items.id)
      if (exists) return

      this.files.push(items)
    }
  }
}
