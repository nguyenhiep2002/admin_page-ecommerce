import { IWestgardRule, flagErrorInPointChain } from "./base.rule";

export class WestGardRule2_2s_1 implements IWestgardRule {
    name: string = '2-2s';
    static group: string = '2-2s';
    static appliedLevels: number[] = [1, 2];
    static errorLevel: number = 2;
    static errorGroup: number = 1;

    checkDataSingleLevel(data: any[]) {
        var me = this;
        let errorPoints = 0;
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (resultByMean > 2 && resultByMean <= 3) {
                if ((x.resultByMean * x.prePoint.resultByMean) >= 0 && x.level == x.prePoint.level)
                    errorPoints++;
                else
                    errorPoints = 1;
            }
            else {
                errorPoints = 0;
            }

            if (errorPoints == 2) {
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
            if (resultByMean > 2 && resultByMean <= 3) {
                if ((x.resultByMean * x.prePoint.resultByMean) >= 0 && x.dateString == x.prePoint.dateString)
                    errorPoints++;
                else
                    errorPoints = 1;
            }
            else {
                errorPoints = 0;
            }

            if (errorPoints == 2) {
                flagErrorInPointChain(x, errorPoints, me.name);
                errorPoints--;
            }
        });
    };
}