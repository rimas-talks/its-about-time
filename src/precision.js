import {assert, average, oomDiff} from "./internal/utils.js";


/**
 * Object containing default values for various benchmark options.
 * @type {{MIN_ENTRIES: number, NUM_ENTRIES: number, MAX_ENTRIES: number, NUM_ITERATIONS: number, MAX_ITERATIONS: number}}
 */
const BenchmarkDefaults = {
    MIN_ENTRIES: 100,
    MAX_ENTRIES: 1_000_000,
    NUM_ENTRIES: 1_000_000,
    MAX_ITERATIONS: 32,
    NUM_ITERATIONS: 10
}


/**
 * A base function that captures the number of unique values generated
 * by calling provided function for a specified number of times.
 * @param name the name for a function under test.
 * @param valueFunc the function to be called for generating the values being assessed.
 * @param perEntries the number of time the value function will be called.
 * @param verbose a flag that enables or disables printing of the information to the console.
 * @returns {number} a number of unique values that were generated.
 */
function uniqueValues(name, valueFunc, perEntries = BenchmarkDefaults.NUM_ENTRIES, verbose = true) {
    assert(BenchmarkDefaults.MIN_ENTRIES <= perEntries && perEntries <= BenchmarkDefaults.MAX_ENTRIES, `Invalid argument 'perEntries', must use a value between ${BenchmarkDefaults.MIN_ENTRIES} and ${BenchmarkDefaults.MAX_ENTRIES} (inclusive), but ${perEntries} was given.`);
    if (verbose) console.log(`Capturing ${Math.floor(perEntries).toLocaleString()} ${name} entries...`);
    const entries = new Set();
    for (let i = 0; i < Math.floor(perEntries); i++) entries.add(valueFunc());
    if (verbose) console.log(`Unique ${name} entries:`, entries.size);
    return entries.size;
}


/**
 * Function capturing unique values using 'new Date().getMilliseconds()' which offers the most
 * precision for our benchmarking purposes, but isn't a UTC timestamp value.
 * @param perEntries the number of time the value function will be called.
 * @param verbose a flag that enables or disables printing of the information to the console.
 * @returns {number} a number of unique values that were generated.
 */
const uniqueValuesDate = (perEntries = BenchmarkDefaults.NUM_ENTRIES, verbose = true) =>
    uniqueValues("Date", () => new Date().getMilliseconds(), perEntries, verbose);


/**
 * Function capturing unique values using 'Date.now()' which produces the least amount of unique values.
 * @param perEntries the number of time the value function will be called.
 * @param verbose a flag that enables or disables printing of the information to the console.
 * @returns {number} a number of unique values that were generated.
 */
const uniqueValuesDateNow = (perEntries = BenchmarkDefaults.NUM_ENTRIES, verbose = true) =>
    uniqueValues("'Date.now()'", () => Date.now(), perEntries, verbose);


/**
 * Function capturing unique values using 'new Date().getTime()'.
 * @param perEntries the number of time the value function will be called.
 * @param verbose a flag that enables or disables printing of the information to the console.
 * @returns {number} a number of unique values that were generated.
 */
const uniqueValuesDateTime = (perEntries = BenchmarkDefaults.NUM_ENTRIES, verbose = true) =>
    uniqueValues("'new Date().getTime()'", () => new Date().getTime(), perEntries, verbose);


/**
 * Function capturing unique values using 'Temporal.Now.instant().epochNanoseconds'.
 * @param perEntries the number of time the value function will be called.
 * @param verbose a flag that enables or disables printing of the information to the console.
 * @returns {number} a number of unique values that were generated.
 */
const uniqueValuesTemporal = (perEntries = BenchmarkDefaults.NUM_ENTRIES, verbose = true) =>
    uniqueValues("Temporal", () => Temporal.Now.instant().epochNanoseconds, perEntries, verbose);


/**
 * Function capturing unique values using 'Temporal.Now.instant().epochMilliseconds'.
 * @param perEntries the number of time the value function will be called.
 * @param verbose a flag that enables or disables printing of the information to the console.
 * @returns {number} a number of unique values that were generated.
 */
const uniqueValuesTemporalMillis = (perEntries = BenchmarkDefaults.NUM_ENTRIES, verbose = true) =>
    uniqueValues("Temporal (milliseconds)", () => Temporal.Now.instant().epochMilliseconds, perEntries, verbose);


/**
 * Function that produces the comparison in orders of magnitude between Date and Temporal API most precise timestamps.
 * @param perEntries the number of times the value functions of both APIs will be called.
 * @param numIterations the number of iterations to use to determine the averages of both APIs.
 * @param dateFunction the function to be used for Date object benchmarks.
 */
function comparison(perEntries = BenchmarkDefaults.NUM_ENTRIES, numIterations = BenchmarkDefaults.NUM_ITERATIONS, dateFunction = uniqueValuesDate) {
    assert(BenchmarkDefaults.MIN_ENTRIES <= perEntries && perEntries <= BenchmarkDefaults.MAX_ENTRIES, `Invalid argument 'perEntries', must use a value between ${BenchmarkDefaults.MIN_ENTRIES} and ${BenchmarkDefaults.MAX_ENTRIES} (inclusive), but ${perEntries} was given.`);
    assert(0 < numIterations && numIterations <= BenchmarkDefaults.MAX_ITERATIONS, `Invalid argument 'numIterations', must use a value between 1 and ${BenchmarkDefaults.MAX_ITERATIONS} (inclusive), but ${numIterations} was given.`);
    console.log(`Capturing ${numIterations} iterations of ${perEntries.toLocaleString()} entries (Date and Temporal.Instant each)...`);
    const resultList = [];

    for (let i = 0; i < numIterations; i++) resultList.push(oomDiff(dateFunction(perEntries, false), uniqueValuesTemporal(perEntries, false)));

    console.log("Orders of magnitude difference:", average(...resultList).toFixed(2));
}


function apis() {
    console.log('\n\x1b[3mDate Object\x1b[0m');
    console.log(' ├ Date.now() '.padEnd(46,' '), Date.now(), '→ Milliseconds, UTC timestamp');
    console.log(' ├ new Date().getTime() '.padEnd(46,' '), new Date().getTime(), '→ Milliseconds, UTC timestamp');
    console.log(' ╰ new Date().getMilliseconds() '.padEnd(46,' '), new Date().getMilliseconds(), '→ Milliseconds, not a UTC timestamp');

    console.log('\n\x1b[3mNode / Browsers\x1b[0m');
    console.log(' ├ performance.now() '.padEnd(46,' '), performance.now(), '→ More precise, but not an absolute UTC timestamp (micro/nano precision)');
    console.log(' ╰ process.hrtime.bigint() '.padEnd(46,' '), process.hrtime.bigint(),'→ Nanosecond precision, monotonic, but not UTC');

    console.log('\n\x1b[3mTemporal API\x1b[0m');
    console.log(' ╰ Temporal.Now.instant().epochNanoseconds '.padEnd(46,' '), Temporal.Now.instant().epochNanoseconds, '→ True nanosecond UTC timestamp as BigInt');
    console.log();
}

export {
    BenchmarkDefaults,
    apis,
    uniqueValuesDate,
    uniqueValuesDateNow,
    uniqueValuesDateTime,
    uniqueValuesTemporal,
    uniqueValuesTemporalMillis,
    comparison
};