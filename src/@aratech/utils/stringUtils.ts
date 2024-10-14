export class StringUtils {
    static format(fmt, ...args) {
        if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
            throw new Error('invalid format string.');
        }

        return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
            if (str) {
                return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
            } else {
                if (index >= args.length) {
                    throw new Error('argument index is out of range in format');
                }
                return args[index];
            }
        });
    }

    static trim(s, c) {
        if (StringUtils.isNullOrEmpty(s))
            return s;

        if (c === "]") c = "\\]";
        if (c === "\\") c = "\\\\";
        return s.replace(new RegExp(
            "^[" + c + "]+|[" + c + "]+$", "g"
        ), "");
    }
    static isNullOrEmpty(string) {
        if (string !== undefined && string !== null && string !== "") {
            return false
        }
        return true;
    }

    static getEmpty(input) {
        if (!input) {
            return '';
        }
        return input;
    }

    static escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    static lowerAndTrim(input: string): string {
        if (!input) return input;

        return input.toLowerCase().trim();
    }

    static compareIgnoreCase(input1: string, input2: string): boolean {
        return StringUtils.lowerAndTrim(input1) === StringUtils.lowerAndTrim(input2);
    }
}
