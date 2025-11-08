import {Temporal} from "temporal-polyfill";

/**
 * Calculates the Gregorian calendar date of the Chinese New Year for a given year.
 * @param year
 * @returns {Temporal.PlainDate}
 */
const chineseNewYear = year =>
    Temporal.PlainDate.from({year: year, month: 7, day: 1})
        .withCalendar('chinese')
        .with({month: 1, day: 1})
        .withCalendar('iso8601');


export {chineseNewYear};