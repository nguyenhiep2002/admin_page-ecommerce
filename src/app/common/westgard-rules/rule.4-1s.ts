import { IWestgardRule, flagErrorInPointChain } from "./base.rule";

export class WestGardRule4_1s_1 implements IWestgardRule {
    name: string = '4-1s';
    static group: string = '4-1s';
    static appliedLevels: number[] = [1, 2];
    static errorLevel: number = 2;
    static errorGroup: number = 1;

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

            if (errorPoints == 4) {
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
                if ((x.resultByMean * x.prePoint.resultByMean) >= 0)
                    errorPoints++;
                else
                    errorPoints = 1;
            }
            else {
                errorPoints = 0;
            }

            if (errorPoints == 1 && x.dateString == x.prePoint.dateString) // is not first point in date
                errorPoints = 0;

            if (errorPoints == 4) {
                flagErrorInPointChain(x, errorPoints, me.name);
                errorPoints--;
            }
        });
    };
}