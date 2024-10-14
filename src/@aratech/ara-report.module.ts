import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseSharedModule } from '@fuse/shared.module';
import { AraReportViewerComponent } from './components/ara-report-viewer/ara-report-viewer.component';
import { LoadResourceService } from './services/loadResource.service';

declare var Stimulsoft: any;
@NgModule({
    declarations: [
        AraReportViewerComponent,
    ],
    imports: [
        MatDialogModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        FuseSharedModule
    ],
    providers: [
        LoadResourceService
    ],
    exports: [
        AraReportViewerComponent
    ],
    bootstrap: [
        AraReportViewerComponent
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
export class AraReportModule {
    constructor(public _loadResource: LoadResourceService) {
        setTimeout(() => {
            Promise.all([
                this._loadResource.loadStyle('assets/styles/stimulReport/stimulsoft.viewer.office2013.whiteblue.css', 'stimulsoft-styles'),
                this._loadResource.loadScript('assets/scripts/stimulReport/stimulsoft.reports.pack.js', 'stimulsoft-reports'),
                this._loadResource.loadScript('assets/scripts/stimulReport/stimulsoft.viewer.pack.js', 'stimulsoft-viewer'),
                this._loadResource.loadScript('assets/scripts/stimulReport/stimulsoft.designer.pack.js', 'stimulsoft-designer'),
            ]).then(() => {
                Stimulsoft.Base.StiLicense.key =
                "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHklPXd5ie5D2OKav+zZQiVJcQP7RiuMc2/JvopR" +
                "n8t5leHX07iANVaD9r8pVaigZBKOqiUt3WI3br7nawsbsdOlNUWx4b5XVnXgJil1QeC/vp2KlxZBhoDR" +
                "NixkajBMzxTzmpY0WvcZbzke6hJJRnjWay97BGBbGpgOe2RCCtIptAhHCHsrmCar9vaRYFydRY1zF6vn" +
                "ZZoB8qp95T24kW6Vi0CYQakP7fRQLBdUVWsgeC1HvIjFKohPg2tpAp1VmZ8m4leWrlnSSMhWidJwYcKy" +
                "3JwSN2kd3E7suCJK5ZTPmIe9CO/jgvFDSBnuss6nE6mmRClarxcg7PB++c4RgEFRE/tb1yTR8U53UhuM" +
                "L03u7ndv2OvGvw3fWUvIjIp44tnVI3a3ll0aBQJFLN1Wu99IDA/JaolGAU5yczL6NxtziKfawXbHBKdL" +
                "dLZgbkQ+AGc5PbkWL9TjYecohMl8ur+NTyLeFytE605K4UsdB363DlE8L0XS3CE2ENn0qvXlqcRH4Pkf" +
                "2M3X8WrOJp91elev";
            });
        }, 500);
    }
}
