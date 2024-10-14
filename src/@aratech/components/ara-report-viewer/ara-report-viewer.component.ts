import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WaitingService } from '@aratech/services/waiting.service';

declare var Stimulsoft: any;
@Component({
    selector: 'ara-report-viewer',
    templateUrl: './ara-report-viewer.component.html',
    styleUrls: ['./ara-report-viewer.component.scss'],
})
export class AraReportViewerComponent implements OnInit {
    options: any = {};
    dataSource: any;    
    viewer: any;
    report: any;

    constructor(public dialogRef: MatDialogRef<AraReportViewerComponent>,
        private waitingService: WaitingService,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.options = data;
    }

    ngOnInit() {
        this.loadReport();
    }

    loadReport() {
        this.viewer = new Stimulsoft.Viewer.StiViewer(null, 'viewerContent', false);
        this.report = new Stimulsoft.Report.StiReport();
        this.report.loadFile(this.options.reportUrl);
        var dataSet = new Stimulsoft.System.Data.DataSet("source");
        dataSet.readJson(this.options.jsonStringData);
        this.report.dictionary.databases.clear();
        this.report.regData(dataSet.dataSetName, dataSet.dataSetName, dataSet);

        if (this.options.variables) {
            for (const key of Object.keys(this.options.variables)) {
                this.report.setVariable(key, this.options.variables[key]);
            }
        }
        
        this.report.render();
        this.viewer.report = this.report;
        this.viewer.renderHtml('viewerContent');
        this.waitingService.stopWaiting(this.options.waitingId);
    }

    cancel(): void
    {
        this.dialogRef.close();
    }
}
