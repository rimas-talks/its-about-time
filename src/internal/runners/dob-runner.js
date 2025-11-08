import {isOfAgeUsingDate, isOfAgeUsingTemporal, isOfAgeWithLocation} from "../../dob.js";
import {confirm, input, select} from "@inquirer/prompts";
import {makeDate, Validations} from "../utils.js";


const VerificationFunctions = {
    SIMPLE_DATE: isOfAgeUsingDate, SIMPLE_TEMPORAL_API: isOfAgeUsingTemporal, LOCATION_AWARE: isOfAgeWithLocation
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