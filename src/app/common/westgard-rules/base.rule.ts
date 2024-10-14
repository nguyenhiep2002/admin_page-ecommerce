export interface IWestgardRule {
    name: string;
    checkDataSingleLevel(data: any[]);
    checkDataMultiLevel(data: any[]);
}

export function flagErrorInPointChain(curPoint, chainLength, errorName) {
    while (chainLength > 0) {
        if (curPoint.errors.indexOf(errorName) < 0)
            curPoint.errors.push(errorName);
        chainLength--;
        flagErrorInPointChain(curPoint.prePoint, chainLength, errorName);
    }
}

export function checkDataByRule<T extends IWestgardRule>(rule: T, data: any[], levelCount: number): Promise<any> {
    var promise = new Promise<void>(resolve => {
        setTimeout(() => {
            if (levelCount == 1)
                rule.checkDataSingleLevel(data);
            else
                rule.checkDataMultiLevel(data);

            resolve();
        }, 0);
    })
    return promise;
};