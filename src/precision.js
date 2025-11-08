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
 * Function capturing unique values using 'new Date().getMilliseconds()' which is the most
 * accurate option available with Date object.
 * @param perEntries the number of time the value function will be called.
 * @param verbose a flag that enables or disables printing of the information to the console.
 * @returns {number} a number of unique values that were generated.
 */
const uniqueValuesDate = (perEntries = BenchmarkDefaults.NUM_ENTRIES, verbose = true) =>
    uniqueValues("Date", () => new Date().getMilliseconds(), perEntries, verbose);


/**
 * Function capturing unique values using 'Date.now()' which generally produces the least amount of unique values.
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
 */
function comparison(perEntries = BenchmarkDefaults.NUM_ENTRIES, numIterations = BenchmarkDefaults.NUM_ITERATIONS) {
    assert(BenchmarkDefaults.MIN_ENTRIES <= perEntries && perEntries <= BenchmarkDefaults.MAX_ENTRIES, `Invalid argument 'perEntries', must use a value between ${BenchmarkDefaults.MIN_ENTRIES} and ${BenchmarkDefaults.MAX_ENTRIES} (inclusive), but ${perEntries} was given.`);
    assert(0 < numIterations && numIterations <= BenchmarkDefaults.MAX_ITERATIONS, `Invalid argument 'numIterations', must use a value between 1 and ${BenchmarkDefaults.MAX_ITERATIONS} (inclusive), but ${numIterations} was given.`);
    console.log(`Capturing ${numIterations} iterations of ${perEntries.toLocaleString()} entries (Date and Temporal.Instant each)...`);
    const resultList = [];

    for (let i = 0; i < numIterations; i++) resultList.push(oomDiff(uniqueValuesDate(perEntries, false), uniqueValuesTemporal(perEntries, false)));

    console.log("Orders of magnitude difference:", average(...resultList).toFixed(2));
}


// TODO Add explainer printout
/*
const timestamp1 = Date.now();
console.log(timestamp1);

const timestamp = new Date().getTime();
console.log(timestamp)

const timestampSeconds = Math.floor(Date.now() / 1000);
console.log(timestampSeconds);

const utcString = new Date().toISOString();
console.log(utcString); // e.g. "2025-09-17T07:04:30.123Z"

const tsBigInt = BigInt(Date.now());
console.log(tsBigInt);

// More precise, but not an absolute UTC timestamp.
console.log(performance.now()); // e.g. 1234.567890123 (micro/nano precision)

// Nanosecond precision, monotonic, not UTC.
const ns = process.hrtime.bigint();
console.log(ns); // e.g. 312345678901234n

// Temporal.Now.instant() gives you a true nanosecond UTC timestamp.
const instant = Temporal.Now.instant();
console.log(instant.epochNanoseconds); // BigInt in ns
*/

export {
    BenchmarkDefaults,
    uniqueValuesDate,
    uniqueValuesDateNow,
    uniqueValuesDateTime,
    uniqueValuesTemporal,
    uniqueValuesTemporalMillis,
    comparison
};