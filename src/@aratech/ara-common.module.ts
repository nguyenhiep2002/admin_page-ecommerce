import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AraCoreModule } from '@aratech/ara-core.module'
import { FuseSharedModule } from '@fuse/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { AddLinkButtonComponent } from './components/add-link-button/add-link-button.component'
import { MultiFileInputComponent } from './components/multi-file-input/multi-file-input.component'
import { MultiImageComponent } from './components/multi-image/multi-image.component'
import { SingleFileComponent } from './components/single-file/single-file.component'
import { UploadFileService } from './services/uploadFile.service'
import { ViewFileService } from './services/view-file.service'

@NgModule({
  declarations: [MultiFileInputComponent, MultiImageComponent, SingleFileComponent, AddLinkButtonComponent],
  imports: [FuseSharedModule, CommonModule, AraCoreModule, TranslateModule],
  entryComponents: [MultiFileInputComponent, MultiImageComponent, SingleFileComponent],
  providers: [UploadFileService, ViewFileService],
  exports: [MultiFileInputComponent, MultiImageComponent, SingleFileComponent, AddLinkButtonComponent],
  bootstrap: []
})
export class AraCommonModule {}
