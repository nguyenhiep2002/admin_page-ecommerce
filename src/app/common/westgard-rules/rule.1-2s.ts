import { IWestgardRule } from "./base.rule";

export class WestGardRule1_2s implements IWestgardRule {
    name: string = '1-2s';
    static group: string = '1-2s';
    static appliedLevels: number[] = [1, 2, 3, 4];
    static errorLevel: number = 1;
    static errorGroup: number = 1;

    checkData(data: any[]) {
        var me = this;
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (resultByMean > 2 && resultByMean <= 3) {
                if (x.errors.indexOf(WestGardRule1_2s.name) < 0) {
                    x.errors.push(WestGardRule1_2s.name);
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