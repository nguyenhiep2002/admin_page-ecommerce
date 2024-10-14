import { IWestgardRule, flagErrorInPointChain } from "./base.rule";

export class WestGardRuleTrend implements IWestgardRule {
    name: string = 'Trend';
    static group: string = 'Trend';
    static appliedLevels: number[] = [1];
    static errorLevel: number = 2;
    static errorGroup: number = 2;

    checkDataSingleLevel(data: any[]) {
        var me = this;
        let errorPoints = 0;
        let maxValue = 0;
        let trendDirection = 0; // 1: up; 0: equals; -1: down
        data.forEach(x => {
            let resultByMean = Math.abs(x.resultByMean);
            if (x.level != x.prePoint.level || errorPoints < 1) {
                errorPoints = 1;
                trendDirection = 0;
            }
            else if (errorPoints == 1) {
                errorPoints = 2;
                trendDirection = this.getDirection(x.prePoint.resultByMean, x.resultByMean);
            }
            else {
                let curDirection = this.getDirection(x.prePoint.resultByMean, x.resultByMean);

                if (curDirection * trendDirection >= 0) {
                    errorPoints++;
                    if (trendDirection === 0) trendDirection = curDirection;                    
                    if (resultByMean > maxValue) maxValue = resultByMean;
                }
                else {
                    errorPoints = this.getErrorPointsChain(2, x.prePoint);
                    trendDirection = curDirection;
                    maxValue = resultByMean;
                    if (Math.abs(x.prePoint.resultByMean) > maxValue)
                        maxValue = Math.abs(x.prePoint.resultByMean);
                }
            }

            if (errorPoints == 6) {
                if (maxValue > 1)
                    flagErrorInPointChain(x, errorPoints, me.name);
                
                errorPoints--;
            }
        });
    }
    checkDataMultiLevel(data: any[]) {
    }

    getDirection(prePoint, curPoint) {
        if (curPoint == prePoint) 
            return 0;
        return curPoint > prePoint ? 1 : -1;
    }

    getErrorPointsChain(errorPoints, curPoint) {
        if (!curPoint.prePoint || !curPoint.prePoint.resultByMean)
            return errorPoints;
        
        let curDirection = this.getDirection(curPoint.prePoint.resultByMean, curPoint.resultByMean);
        if (curDirection !== 0)
            return errorPoints;

        errorPoints++;    
        return this.getErrorPointsChain(errorPoints, curPoint.prePoint);
    }
}