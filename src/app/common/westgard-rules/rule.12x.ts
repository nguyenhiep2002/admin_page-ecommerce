import { IWestgardRule, flagErrorInPointChain } from "./base.rule";

export class WestGardRule12x_1 implements IWestgardRule {
    name: string = '12x';
    static group: string = '12x';
    static appliedLevels: number[] = [1, 3, 4];
    static errorLevel: number = 2;
    static errorGroup: number = 2;

    checkDataSingleLevel(data: any[]) {
        var me = this;
        let errorPoints = 0;
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (resultByMean > 0) {
                if ((x.resultByMean * x.prePoint.resultByMean) >= 0 && x.level == x.prePoint.level)
                    errorPoints++;
                else
                    errorPoints = 1;
            }
            else {
                errorPoints = 0;
            }

            if (errorPoints == 12) {
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
            if (resultByMean > 0) {
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

            if (errorPoints == 12) {
                flagErrorInPointChain(x, errorPoints, me.name);
                errorPoints--;
            }
        });
    };
}