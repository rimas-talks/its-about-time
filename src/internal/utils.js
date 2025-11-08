/**
 * Evaluates given condition, and throws an error if it is not met.
 * Use it to validate function arguments, etc.
 * @param condition
 * @param message
 */
function assert(condition, message = 'Assertion failed') {
    if (!condition) throw new Error(message);
}


/**
 * Creates location bound datetime.
 * @param date string formatted as YYYY-MM-DD, or YYYY-MM-DDThh:mm, etc.
 * @param timeZoneId default value is Europe/Zurich
 * @returns {Temporal.ZonedDateTime}
 */
const makeDate = (date, timeZoneId = 'Europe/Zurich') => Temporal.PlainDateTime.from(date).toZonedDateTime(timeZoneId);


/**
 * Calculates the average of given numbers.
 * @param nums
 * @returns {number}
 */
const average = (...nums) => nums.length ? nums.reduce((a, b) => a + b) / nums.length : 0;


/**
 * Calculates orders of magnitude difference between given values.
 * @param a
 * @param b
 * @returns {number}
 */
const oomDiff = (a, b) => Math.abs(Math.log10(a) - Math.log10(b));


/**
 * A convenience object containing various input validations.
 * @type {{isTimeZoneId: (function(*): boolean), isDate: (function(*): boolean), isYear: (function(*): boolean), isTime: (function(*): boolean), isAllowedAge: (function(*): *)}}
 */
const Validations = {
    isYear: value => /^\d{4}$/.test(value),
    isDate: value => /^\d{4}-\d{2}-\d{2}$/.test(value),
    isTime: value => /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(value),
    isAllowedAge: value => !Number.isNaN(Number(value)) && Number(value) > 0,
    isTimeZoneId: value => /^[A-Za-z]+(?:\/[A-Za-z_]+)+$/.test(value)
}


export {assert, makeDate, average, oomDiff, Validations};