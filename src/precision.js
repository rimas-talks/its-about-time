import {program} from "commander";
import {assert, average, oomDiff} from "./utils.js";

const MIN_ENTRIES = 100;
const MAX_ENTRIES = 1_000_000;
const NUM_ENTRIES = 1_000_000;
const MAX_ITERATIONS = 32;
const NUM_ITERATIONS = 10;


function uniqueValues(name, valueFunc, perEntries = NUM_ENTRIES, verbose = true) {
    assert(MIN_ENTRIES <= perEntries && perEntries <= MAX_ENTRIES, `Invalid argument 'perEntries', must use a value between ${MIN_ENTRIES} and ${MAX_ENTRIES} (inclusive), but ${perEntries} was given.`);
    if (verbose) console.log(`Capturing ${Math.floor(perEntries).toLocaleString()} ${name} entries...`);
    const entries = new Set();
    for (let i = 0; i < Math.floor(perEntries); i++) entries.add(valueFunc());
    if (verbose) console.log(`Unique ${name} entries:`, entries.size);
    return entries.size;
}

function uniqueValuesDate(perEntries = NUM_ENTRIES, verbose = true) {
    return uniqueValues("Date", () => new Date().getMilliseconds(), perEntries, verbose);
}

function uniqueValuesTemporal(perEntries = NUM_ENTRIES, verbose = true) {
    return uniqueValues("Temporal", () => Temporal.Now.instant().epochNanoseconds, perEntries, verbose);
}

function comparison(perEntries = NUM_ENTRIES, numIterations = NUM_ITERATIONS) {
    assert(MIN_ENTRIES <= perEntries && perEntries <= MAX_ENTRIES, `Invalid argument 'perEntries', must use a value between ${MIN_ENTRIES} and ${MAX_ENTRIES} (inclusive), but ${perEntries} was given.`);
    assert(0 < numIterations && numIterations <= MAX_ITERATIONS, `Invalid argument 'numIterations', must use a value between 1 and ${MAX_ITERATIONS} (inclusive), but ${numIterations} was given.`);
    console.log(`Capturing ${numIterations} iterations of ${perEntries.toLocaleString()} entries (Date and Temporal.Instant each)...`);
    const resultList = [];

    for (let i = 0; i < numIterations; i++) resultList.push(oomDiff(uniqueValuesDate(perEntries, false), uniqueValuesTemporal(perEntries, false)));

    console.log("Orders of magnitude difference:", average(...resultList).toFixed(2));
}


program
    .name('precision')
    .description('JavaScript CLI demonstrating precision differences between Date, and Temporal API.')
    .version('1.0.0');

program
    .command('date')
    .description('outputs the number of unique Date values when captured sequentially for a given number of entries')
    .option('-e, --per-entries <number>', 'number of entries', NUM_ENTRIES)
    .action((options) => {
        try {
            const perEntries = typeof options.perEntries == "string" ? options.perEntries.replace(/[^\d.-]/g, "") : options.perEntries;
            uniqueValuesDate(perEntries);
        } catch (e) {
            console.log(e.message);
        }
    });

program
    .command('temporal')
    .description('outputs the number of unique Temporal.Instant values when captured sequentially for a given number of entries')
    .option('-e, --per-entries <number>', 'number of entries', NUM_ENTRIES)
    .action((options) => {
        try {
            const perEntries = typeof options.perEntries == "string" ? options.perEntries.replace(/[^\d.-]/g, "") : options.perEntries;
            uniqueValuesTemporal(perEntries);
        } catch (e) {
            console.log(e.message);
        }
    });

program
    .command('compare')
    .description('outputs the difference in orders of magnitude between unique Date and Temporal.Instant values when captured sequentially for a given number of entries over a specified number of iterations')
    .option('-i, --num-iterations <number>', 'number of iterations', NUM_ITERATIONS)
    .option('-e, --per-entries <number>', 'number of entries', NUM_ENTRIES)
    .action((options) => {
        try {
            const numIterations = typeof options.numIterations == "string" ? options.numIterations.replace(/[^\d.-]/g, "") : options.numIterations;
            const perEntries = typeof options.perEntries == "string" ? options.perEntries.replace(/[^\d.-]/g, "") : options.perEntries;
            comparison(perEntries, numIterations);
        } catch (e) {
            console.log(e.message);
        }
    });

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


program.parse();