import { IWestgardRule } from "./base.rule";

export class WestGardRuleR_4s implements IWestgardRule {
    name: string = 'R-4s';
    static group: string = 'R-4s';
    static appliedLevels: number[] = [2];
    static errorLevel: number = 2;
    static errorGroup: number = 1;

    checkDataSingleLevel(data: any[]) {
    }
    checkDataMultiLevel(data: any[]) {
        var me = this;
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            let distance = Math.abs(x.resultByMean - x.prePoint.resultByMean);

            if (resultByMean > 2 && resultByMean <= 3 && distance > 4 && x.dateString == x.prePoint.dateString) {
                if (x.errors.indexOf(me.name) < 0) {
                    x.errors.push(me.name);
                    x.prePoint.errors.push(me.name);
                }
            }
        });
    }
}