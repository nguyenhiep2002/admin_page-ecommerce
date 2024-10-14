import { WestGardRule1_2s } from "./rule.1-2s";
import { WestGardRule1_3s } from "./rule.1-3s";
import { WestGardRule2_2s_1 } from "./rule.2-2s";
import { WestGardRule4_1s_1 } from "./rule.4-1s";
import { WestGardRule10x_1 } from "./rule.10x";
import { WestGardRule2Of3_2s_1 } from "./rule.2of3-2s";
import { WestGardRule3_1s_1 } from "./rule.3-1s";
import { WestGardRule12x_1 } from "./rule.12x";
import { WestGardRule9x_1 } from "./rule.9x";
import { WestGardRule8x_1 } from "./rule.8x";
import { WestGardRule6x_1 } from "./rule.6x";
import { WestGardRule7t_1 } from "./rule.7t";
import { WestGardRuleR_4s } from "./rule.r-4s";
import { checkDataByRule } from "./base.rule";
import { WestGardRuleShift } from "./rule.shift";
import { WestGardRuleTrend } from "./rule.trend";
import * as _ from 'underscore';

export const WestGardRules = [
    WestGardRule1_2s,
    WestGardRule1_3s,
    WestGardRule2_2s_1,
    WestGardRule2Of3_2s_1,
    WestGardRule4_1s_1,
    WestGardRule3_1s_1,
    WestGardRule12x_1,
    WestGardRule10x_1,
    WestGardRule9x_1,
    WestGardRule8x_1,
    WestGardRule6x_1,
    WestGardRule7t_1,
    WestGardRuleR_4s,
    WestGardRuleShift,
    WestGardRuleTrend
];

export class WestGardRuleChecker {
    static calculateAvg(...array: number[]) {
        if (array.length == 0) return NaN;

        let sum = 0;
        array.forEach(x => {
            sum += x;
        });
        return sum/array.length;
    }

    static calculateStDev(avg: number, ...array: number[]) {
        if (array.length <= 1) return NaN;
        
        let sumPow = 0;
        array.forEach(x => {
            sumPow += Math.pow(x - avg, 2);
        });
        let stDev = Math.sqrt(sumPow/(array.length - 1));
        return stDev;
    }

    static getListRuleNames():string[] {
        const result = WestGardRules.map(x => x.group);
        return result;
    }

    static getListRulesInfo() {
        const result = WestGardRules.map(x => {
            return {
                name: x.group, 
                errorLevel: x.errorLevel,
                errorGroup: x.errorGroup                
            };
        });
        return result;
    }

    static checkRules(data: any[], levelArray: number[], checkMultiLevel: boolean): Promise<any> {
        var tasks: Promise<void>[] = [];

        //single level check
        let prePoint = { resultByMean: 0 };
        data.forEach(x => {
            x.prePoint = prePoint;
            x.prePointOnLevel = prePoint;
            prePoint = x;
        });
        let rules = WestGardRules.filter(r => r.appliedLevels.indexOf(1) >= 0);
        rules.forEach(rule => {
            var ruleObj = new rule();
            tasks.push(checkDataByRule(ruleObj, data, 1));
        });

        return Promise.all(tasks).then(() => {
            //multi levels check
            if (levelArray.length > 1 && checkMultiLevel) {
                var multiLevelTasks: Promise<void>[] = [];
                let groupFunc = function (item) {
                    return item.date.toISOString();
                };
                data.sort((x, y) => {
                    let timeSpan = x.date - y.date;
                    if (timeSpan == 0)
                        return x.level - y.level;
                    return timeSpan;
                });
                let customData = _.groupBy(data, groupFunc);
                let chainPoints = [];
                let prePoint = { resultByMean: 0 };
                for (const key of Object.keys(customData)) {
                    levelArray.forEach(level => {
                        let point = customData[key].find(x => x.level == level);
                        if (!point) {
                            point = {
                                resultByMean: 0,
                                date: new Date(key),
                                level: level,
                                errors: []
                            }
                        }
                        point.dateString = key;
                        point.prePoint = prePoint;
                        chainPoints.push(point);
                        prePoint = point;
                    });
                }
                let rules = WestGardRules.filter(r =>  r.appliedLevels.indexOf(levelArray.length) >= 0);
                rules.forEach(rule => {
                    var ruleObj = new rule();
                    multiLevelTasks.push(checkDataByRule(ruleObj, chainPoints, levelArray.length));
                });

                return Promise.all(multiLevelTasks);
            }
        });
    }
}