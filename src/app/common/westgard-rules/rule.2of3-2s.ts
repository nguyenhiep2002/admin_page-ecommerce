import { IWestgardRule } from "./base.rule";

export class WestGardRule2Of3_2s_1 implements IWestgardRule {
    name: string = '2of3-2s';
    static group: string = '2of3-2s';
    static appliedLevels: number[] = [1, 3];
    static errorLevel: number = 2;
    static errorGroup: number = 2;

    checkDataSingleLevel(data: any[]) {
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (resultByMean > 2 && resultByMean <= 3) {
                if ((x.resultByMean * x.prePoint.resultByMean) > 0 && Math.abs(x.prePoint.resultByMean) < 2 && x.level == x.prePoint.level) { //middlePoint
                    let firstMean = x.prePoint.prePoint.resultByMean;
                    let firstMeanAbs = Math.abs(firstMean);
                    if (firstMeanAbs > 2 && firstMeanAbs <= 3 && (x.resultByMean * firstMean) > 0 && x.level == x.prePoint.prePoint.level) {
                        x.errors.push(this.name);
                        x.prePoint.prePoint.errors.push(this.name);
                    }
                }
            }
        });
    };

    checkDataMultiLevel(data: any[]) {
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (resultByMean > 2 && resultByMean <= 3) {
                if ((x.resultByMean * x.prePoint.resultByMean) > 0 && Math.abs(x.prePoint.resultByMean) < 2 && x.dateString == x.prePoint.dateString) { //middlePoint
                    let firstMean = x.prePoint.prePoint.resultByMean;
                    let firstMeanAbs = Math.abs(firstMean);
                    if (firstMeanAbs > 2 && firstMeanAbs <= 3 && (x.resultByMean * firstMean) > 0 && x.dateString == x.prePoint.prePoint.dateString) {
                        x.errors.push(this.name);
                        x.prePoint.prePoint.errors.push(this.name);
                    }
                }
            }
        });
    };
}