import {program} from "commander";
import {
    apis,
    BenchmarkDefaults,
    comparison,
    uniqueValuesDate,
    uniqueValuesDateNow, uniqueValuesDateTime,
    uniqueValuesTemporal,
    uniqueValuesTemporalMillis
} from "../../precision.js";


program
    .name('precision')
    .description('JavaScript CLI demonstrating precision differences between Date, and Temporal API.')
    .version('1.0.0');

program
    .command('apis')
    .description('outputs some of the available APIs, their values, and relevant notes')
    .action(() => {
        try {
            apis();
        } catch (e) {
            console.log(e.message);
        }
    });

program
    .command('date')
    .description('outputs the number of unique Date values when captured sequentially for a given number of entries')
    .option('-e, --per-entries <number>', 'number of entries', BenchmarkDefaults.NUM_ENTRIES)
    .option('-f, --function <name>', 'function to be used. Possible values: millis, now, time', 'millis')
    .action((options) => {
        try {
            const perEntries = typeof options.perEntries == "string" ? options.perEntries.replace(/[^\d.-]/g, "") : options.perEntries;
            switch (options.function) {
                case 'now':
                    uniqueValuesDateNow(perEntries);
                    break;
                case 'time':
                    uniqueValuesDateTime(perEntries);
                    break;
                case 'millis':
                default:
                    uniqueValuesDate(perEntries);
                    break;
            }
        } catch (e) {
            console.log(e.message);
        }
    });

program
    .command('temporal')
    .description('outputs the number of unique Temporal.Instant values when captured sequentially for a given number of entries')
    .option('-e, --per-entries <number>', 'number of entries', BenchmarkDefaults.NUM_ENTRIES)
    .option('-f, --function <name>', 'function to be used. Possible values: nanos, millis', 'nanos')
    .action((options) => {
        try {
            const perEntries = typeof options.perEntries == "string" ? options.perEntries.replace(/[^\d.-]/g, "") : options.perEntries;
            switch (options.function) {
                case 'millis':
                    uniqueValuesTemporalMillis(perEntries);
                    break;
                case 'nanos':
                default:
                    uniqueValuesTemporal(perEntries);
                    break;
            }
        } catch (e) {
            console.log(e.message);
        }
    });

program
    .command('compare')
    .description('outputs the difference in orders of magnitude between unique Date and Temporal.Instant values when captured sequentially for a given number of entries over a specified number of iterations')
    .option('-i, --num-iterations <number>', 'number of iterations', BenchmarkDefaults.NUM_ITERATIONS)
    .option('-e, --per-entries <number>', 'number of entries', BenchmarkDefaults.NUM_ENTRIES)
    .option('-f, --date-function <name>', 'function to be used for Date object benchmarking. Possible values: millis, now, time', 'millis')
    .action((options) => {
        try {
            const numIterations = typeof options.numIterations == "string" ? options.numIterations.replace(/[^\d.-]/g, "") : options.numIterations;
            const perEntries = typeof options.perEntries == "string" ? options.perEntries.replace(/[^\d.-]/g, "") : options.perEntries;
            let dateFunction;
            switch (options.dateFunction) {
                case 'now':
                    dateFunction = uniqueValuesDateNow;
                    break;
                case 'time':
                    dateFunction = uniqueValuesDateTime;
                    break;
                case 'millis':
                default:
                    dateFunction = uniqueValuesDate;
                    break;
            }
            comparison(perEntries, numIterations, dateFunction);
        } catch (e) {
            console.log(e.message);
        }
    });


program.parse();
