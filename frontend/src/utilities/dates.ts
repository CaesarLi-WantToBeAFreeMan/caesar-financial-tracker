/*
 * date conversions and validations
 * date tokens
 *  0. YYYY: 4-digit year (e.g. 2026)
 *  1. yy: 2-digit year (e.g. 26)
 *  2. MMMM: full english month name (e.g. January)
 *  3. MMM: abbreviated engligh month name (e.g. Jan)
 *  4. MM: 0-padded month number [01, 12] (e.g. 01)
 *  5. M: unpadded month number [1, 12] (e.g. 1)
 *  6. DD: 0-padded day number [01, 31] (e.g. 01)
 *  7. D: unpadded day number [1, 31] (e.g. 1)
 *  8. ZH: chinese month (e.g. 一月)
 *  9. ZHF: chinese formal month (e.g. 壹月)
 *  10. {sep}: separator
 */

import {format, parseISO, isValid, isBefore, isEqual} from "date-fns";
import {formatInTimeZone} from "date-fns-tz";

//chinese month names
const ZH_MONTHS = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const ZHF_MONTHS = ["壹月", "貳月", "參月", "肆月", "伍月", "陸月", "柒月", "捌月", "玖月", "拾月", "拾壹月", "拾貳月"];

//types
export type DateFormatToken = string;

const DATE_TOKEN_MAP: Record<string, string> = {
    YYYY: "yyyy",
    YY: "yy",
    MMMM: "MMMM",
    MMM: "MMM",
    MM: "MM",
    M: "M",
    DD: "dd",
    D: "d",
    ZHF: "'%%ZHF%%'",
    ZH: "'%%ZH%%'"
};

export const DATE_FORMAT_OPTIONS: DateFormatToken[] = [
    //slash separated numeric
    "MM/DD/YYYY",
    "M/D/YYYY",
    "MM/DD/YY",
    "M/D/YY",
    "DD/MM/YYYY",
    "D/M/YYYY",
    "DD/MM/YY",
    "D/M/YY",
    "YYYY/MM/DD",
    "YYYY/M/D",
    "YY/MM/DD",
    "YY/M/D",

    //dash separated numeric
    "MM-DD-YYYY",
    "M-D-YYYY",
    "MM-DD-YY",
    "M-D-YY",
    "DD-MM-YYYY",
    "D-M-YYYY",
    "DD-MM-YY",
    "D-M-YY",
    "YYYY-MM-DD",
    "YYYY-M-D",
    "YY-MM-DD",
    "YY-M-D",

    //dot separated numeric
    "MM.DD.YYYY",
    "M.D.YYYY",
    "MM.DD.YY",
    "M.D.YY",
    "DD.MM.YYYY",
    "D.M.YYYY",
    "DD.MM.YY",
    "D.M.YY",
    "YYYY.MM.DD",
    "YYYY.M.D",
    "YY.MM.DD",
    "YY.M.D",

    //slash separated abbreviated english month name
    "MMM/DD/YYYY",
    "MMM/D/YYYY",
    "MMM/DD/YY",
    "MMM/D/YY",
    "DD/MMM/YYYY",
    "D/MMM/YYYY",
    "DD/MMM/YY",
    "D/MMM/YY",
    "YYYY/MMM/DD",
    "YYYY/MMM/D",
    "YY/MMM/DD",
    "YY/MMM/D",

    //dash separated abbreviated english month name
    "MMM-DD-YYYY",
    "MMM-D-YYYY",
    "MMM-DD-YY",
    "MMM-D-YY",
    "DD-MMM-YYYY",
    "D-MMM-YYYY",
    "DD-MMM-YY",
    "D-MMM-YY",
    "YYYY-MMM-DD",
    "YYYY-MMM-D",
    "YY-MMM-DD",
    "YY-MMM-D",

    //slash separated full english month name
    "MMMM/DD/YYYY",
    "MMMM/D/YYYY",
    "MMMM/DD/YY",
    "MMMM/D/YY",
    "DD/MMMM/YYYY",
    "D/MMMM/YYYY",
    "DD/MMMM/YY",
    "D/MMMM/YY",
    "YYYY/MMMM/DD",
    "YYYY/MMMM/D",
    "YY/MMMM/DD",
    "YY/MMMM/D",

    //dash separated full english month name
    "MMMM-DD-YYYY",
    "MMMM-D-YYYY",
    "MMMM-DD-YY",
    "MMMM-D-YY",
    "DD-MMMM-YYYY",
    "D-MMMM-YYYY",
    "DD-MMMM-YY",
    "D-MMMM-YY",
    "YYYY-MMMM-DD",
    "YYYY-MMMM-D",
    "YY-MMMM-DD",
    "YY-MMMM-D",

    //natural english format
    "MMM D, YYYY",
    "MMM DD, YYYY",
    "MMM D, YY",
    "MMM DD, YY",
    "MMMM D, YYYY",
    "MMMM DD, YYYY",
    "MMMM D, YY",
    "MMMM DD, YY",
    "D MMM YYYY",
    "DD MMM YYYY",
    "D MMM YY",
    "DD MMM YY",
    "D MMMM YYYY",
    "DD MMMM YYYY",
    "D MMMM YY",
    "DD MMMM YY",

    //chinese month name
    "YYYY年ZH DD日",
    "YYYY年ZH D日",
    "YY年ZH DD日",
    "YY年ZH D日",

    //chinese formal month name
    "YYYY年ZHF DD日",
    "YYYY年ZHF D日",
    "YY年ZHF DD日",
    "YY年ZHF D日",

    //chinese numeric month
    "YYYY年MM月DD日",
    "YYYY年M月D日",
    "YY年MM月DD日",
    "YY年M月D日"
];

//formatters
//local date object to ISO (yyyy-MM-DD)
export const toISO = (date: Date): string => format(date, "yyyy-MM-dd");

//ISO to date object at 00:00:00 am
export const fromISO = (iso: string): Date => {
    const date = parseISO(iso + "T12:00:00Z");
    return isValid(date) ? date : new Date(iso + "T12:00:00Z");
};

const TOKEN_REGEX = /YYYY|YY|MMMM|MMM|MM|M|DD|D|ZHF|ZH/g;

export function formatDate(dateString: string, token: DateFormatToken, timezoneString?: string): string {
    try {
        const date = fromISO(dateString);
        if (!isValid(date)) return dateString;
        //convert to date-fns tokens
        const tokenConvert = token.replace(TOKEN_REGEX, t => DATE_TOKEN_MAP[t] ?? t);

        const timezone = timezoneString ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
        const raw = formatInTimeZone(date, timezone, tokenConvert);

        const monthIndex = new Date(formatInTimeZone(date, timezone, "yyyy-MM-dd") + "T00:00:00").getMonth();
        return raw.replace("%%ZHF%%", ZHF_MONTHS[monthIndex]).replace("%%ZH%%", ZH_MONTHS[monthIndex]);
    } catch {
        return dateString;
    }
}

//getters
export const getDate = (): string => format(new Date(), "yyyy-MM-dd");

//validations
//validate a date range
export const isValidDateRange = (dateStart: string, dateEnd: string): boolean => {
    const [start, end, now] = [fromISO(dateStart), fromISO(dateEnd), fromISO(getDate())];
    return (
        isBefore(start, now) ||
        (isEqual(start, now) &&
            (isBefore(end, now) || isEqual(end, now)) &&
            (isBefore(start, end) || isEqual(start, end)))
    );
};
