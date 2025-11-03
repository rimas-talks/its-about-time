import {input, select, confirm} from '@inquirer/prompts';
import {makeDate} from "./utils.js";


function isOfAgeUsingDate(onDate, birthday, minAge = 18) {
    const verificationDate = new Date(onDate);
    const birthDate = new Date(birthday);

    let birthdayMonth = birthDate.getMonth();
    let birthdayDay = birthDate.getDate();

    // Handle leap day birthdays on non-leap years → shift to Mar 1
    if (birthdayMonth === 1 && birthdayDay === 29) {
        const year = verificationDate.getFullYear();
        const isLeap = new Date(year, 1, 29).getDate() === 29;
        if (!isLeap) birthdayDay = 28;
    }

    let age = verificationDate.getFullYear() - birthDate.getFullYear();

    const hasHadBirthday = verificationDate.getMonth() > birthdayMonth || (verificationDate.getMonth() === birthdayMonth && verificationDate.getDate() >= birthdayDay);

    if (!hasHadBirthday) age--;

    return age >= minAge;
}


function isOfAgeUsingTemporal(onDate, birthday, minAge = 18) {
    // For non-leap years February 29th gets constrained to 28th automatically due to overflow defaulting to "constrain"
    const verificationDate = Temporal.PlainDate.from(onDate);
    const birthDate = Temporal.PlainDate.from(birthday);

    let age = verificationDate.year - birthDate.year - (Temporal.PlainDate
        .compare(verificationDate, birthDate.with({year: verificationDate.year})) < 0);

    return age >= minAge;
}


function isOfAgeWithLocation(onDate, birthday, minAge = 18, forceMarch1 = false) {
    const requiredYears = Temporal.Duration.from({years: minAge});
    let adjustedBirthday = birthday.add(requiredYears);

    if (forceMarch1 && birthday.month === 2 && birthday.day === 29 && !onDate.toPlainDate().inLeapYear) adjustedBirthday = adjustedBirthday.add({days: 1});

    return Temporal.ZonedDateTime.compare(onDate, adjustedBirthday) >= 0;
}


const VerificationFunctions = {
    SIMPLE_DATE: isOfAgeUsingDate, SIMPLE_TEMPORAL_API: isOfAgeUsingTemporal, LOCATION_AWARE: isOfAgeWithLocation
}


const Validations = {
    isDate: value => /^\d{4}-\d{2}-\d{2}$/.test(value),
    isTime: value => /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(value),
    isAllowedAge: value => !Number.isNaN(Number(value)) && Number(value) > 0,
    isTimeZoneId: value => /^[A-Za-z]+(?:\/[A-Za-z_]+)+$/.test(value)
}


const captureSimpleData = async function () {
    const verificationDate = await input({
        message: 'Specify verification date (format: YYYY-MM-DD):',
        required: true,
        default: '2025-02-28',
        validate: Validations.isDate
    });
    const birthday = await input({
        message: 'Provide birthday date:', required: true, default: '2004-02-29', validate: Validations.isDate
    });
    const minAge = Number(await input({
        message: 'Minimum required age:', required: true, default: 21, validate: Validations.isAllowedAge
    }));
    return {
        verificationDate, birthday, minAge
    }
}


const captureDataWithLocation = async function(){
    const verificationLocation = await input({
        message: 'Specify verification timezone ID (IANA format):',
        required: true,
        default: 'Europe/Zurich',
        validate: Validations.isTimeZoneId
    });
    const verificationDate = await input({
        message: 'Specify verification date (format: YYYY-MM-DD):',
        required: true,
        default: '2025-02-28',
        validate: Validations.isDate
    });
    const verificationTime = await input({
        message: 'Specify verification time (format: hh:mm:ss, or hh:mm):',
        required: true,
        default: '06:00',
        validate: Validations.isTime
    });
    const birthplace = await input({
        message: 'Specify birthplace timezone ID:',
        required: true,
        default: 'America/New_York',
        validate: Validations.isTimeZoneId
    });
    const birthday = await input({
        message: 'Provide birthday date:', required: true, default: '2004-02-29', validate: Validations.isDate
    });
    const minAge = Number(await input({
        message: 'Minimum required age:', required: true, default: 21, validate: Validations.isAllowedAge
    }));
    const forceMarch1 = await confirm({ message: 'Force leap year birthdays to March 1st?', default:false });
    return {
        verificationLocation,
        verificationDate,
        verificationTime,
        birthplace,
        birthday,
        minAge,
        forceMarch1
    }
}


const main = async function () {
    const verificationFunction = await select({
        message: 'Select age verification function:', choices: [{
            name: 'Simple (using Date)',
            value: VerificationFunctions.SIMPLE_DATE,
            description: 'Simple age verification function using Date objects.',
        }, {
            name: 'Simple (using Temporal API)',
            value: VerificationFunctions.SIMPLE_TEMPORAL_API,
            description: 'Simple age verification function using Temporal API.',
        }, {
            name: 'Location-Aware',
            value: VerificationFunctions.LOCATION_AWARE,
            description: 'Location aware age verification function using Temporal API',
        }],
    });

    switch (verificationFunction) {
        case VerificationFunctions.LOCATION_AWARE:
            const dataWithLocation = await captureDataWithLocation();
            const verificationDate = makeDate(`${dataWithLocation.verificationDate}T${dataWithLocation.verificationTime}`, dataWithLocation.verificationLocation);
            const birthDate = makeDate(dataWithLocation.birthday, dataWithLocation.birthplace);
            console.log('Is of required minimum age:', verificationFunction(verificationDate, birthDate, dataWithLocation.minAge, dataWithLocation.forceMarch1));
            break;
        default:
            const simpleData = await captureSimpleData();
            console.log('Is of required minimum age:', verificationFunction(simpleData.verificationDate, simpleData.birthday, simpleData.minAge));
            break;
    }
}

await main();