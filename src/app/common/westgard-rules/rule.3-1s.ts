import { IWestgardRule, flagErrorInPointChain } from "./base.rule";

export class WestGardRule3_1s_1 implements IWestgardRule {
    name: string = '3-1s';
    static group: string = '3-1s';
    static appliedLevels: number[] = [1, 3];
    static errorLevel: number = 2;
    static errorGroup: number = 2;

    checkDataSingleLevel(data: any[]) {
        var me = this;
        let errorPoints = 0;
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (resultByMean > 1 && resultByMean <= 2) {
                if ((x.resultByMean * x.prePoint.resultByMean) >= 0 && x.level == x.prePoint.level)
                    errorPoints++;
                else
                    errorPoints = 1;
            }
            else {
                errorPoints = 0;
            }

            if (errorPoints == 3) {
                flagErrorInPointChain(x, errorPoints, me.name);
                errorPoints--;
            }
        });
    };

    checkDataMultiLevel(data: any[]) {
        var me = this;
        let errorPoints = 0;
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (resultByMean > 1 && resultByMean <= 2) {
                if ((x.resultByMean * x.prePoint.resultByMean) >= 0 && x.dateString == x.prePoint.dateString)
                    errorPoints++;
                else
                    errorPoints = 1;
            }
            else {
                errorPoints = 0;
            }

            if (errorPoints == 3) {
                flagErrorInPointChain(x, errorPoints, me.name);
                errorPoints--;
            }
        });
    };
}