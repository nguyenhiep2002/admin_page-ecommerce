export class Guid {
    static newGuid() {
        var S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        var guid = (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()
        return guid
    }

    public static Empty: string = '00000000-0000-0000-0000-000000000000'

    static isGuid(id: string): boolean {
        const guidRegex: RegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
        return guidRegex.test(id)
    }
}
