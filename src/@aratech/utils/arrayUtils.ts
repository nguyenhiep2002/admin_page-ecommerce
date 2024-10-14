import _ from 'lodash'

export class ArrayUtils {
    static removeItem(array: any[], item: any) {
        let rIndex = array.indexOf(item)
        if (rIndex > -1) {
            array.splice(rIndex, 1)
        }
    }

}
