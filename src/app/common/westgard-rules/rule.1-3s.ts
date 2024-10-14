import { IWestgardRule } from "./base.rule";

export class WestGardRule1_3s implements IWestgardRule {
    name: string = '1-3s';
    static group: string = '1-3s';
    static appliedLevels: number[] = [1, 2, 3, 4];
    static errorLevel: number = 2;
    static errorGroup: number = 1;

    checkData(data: any[]) {
        var me = this;
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (resultByMean > 3) {
                if (x.errors.indexOf(me.name) < 0) {
                    x.errors.push(me.name);
                }
            }
        });
    };

    checkDataSingleLevel(data: any[]) {
        this.checkData(data);
    }
    checkDataMultiLevel(data: any[]) {
        this.checkData(data);
    }
}