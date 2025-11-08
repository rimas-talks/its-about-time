import {input} from "@inquirer/prompts";
import {Validations} from "../utils.js";
import {chineseNewYear} from "../../calendar.js";


// Reference: https://en.wikipedia.org/wiki/Chinese_New_Year#Dates_in_the_Chinese_lunisolar_calendar
const dates = new Map([
    [2024, '2024-02-10'],
    [2025, '2025-01-29'],
    [2026, '2026-02-17'],
    [2027, '2027-02-06'],
    [2028, '2028-01-26'],
    [2029, '2029-02-13'],
    [2030, '2030-02-03'],
    [2031, '2031-01-23'],
    [2032, '2032-02-11'],
    [2033, '2033-01-31'],
    [2034, '2034-02-19'],
    [2035, '2035-02-08']
]);


const main = async function () {
    console.log('\n  Chinese New Year Date For the...');
    const year = Number(await input({
        message: ' year ┊', required: true, default: Temporal.Now.plainDateISO().year, validate: Validations.isYear
    }));
    const chineseNewYearDate = chineseNewYear(year).toString();
    const isAccurate = dates.has(year) && dates.get(year) === chineseNewYearDate;
    console.log(`  \x1b[1m\x1b[41m\x1b[37m   is  \x1b[0m\x1b[30m\x1b[47m ${chineseNewYearDate}${isAccurate ? ' ' : '¹ '}\x1b[0m`);
    if (!isAccurate) {
        console.log();
        dates.has(year) ?
            console.log(`  ¹ Calendar implementation is not 100% accurate, real date should be ${dates.get(year)}.`) :
            console.log(`  ¹ The result for year ${year} cannot be verified, and may be inaccurate. `);
    }
    console.log();
}


await main();