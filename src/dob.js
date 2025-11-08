/**
 * A simple age verification function, does not take into account time or timezones, implemented using Date object.
 * @param onDate
 * @param birthday
 * @param minAge
 * @returns {boolean}
 */
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


/**
 * A simple age verification function, does not take into account time or timezones, implemented using Temporal API.
 * @param onDate
 * @param birthday
 * @param minAge
 * @returns {boolean}
 */
function isOfAgeUsingTemporal(onDate, birthday, minAge = 18) {
    // For non-leap years February 29th gets constrained to 28th automatically due to overflow defaulting to "constrain"
    const verificationDate = Temporal.PlainDate.from(onDate);
    const birthDate = Temporal.PlainDate.from(birthday);

    let age = verificationDate.year - birthDate.year - (Temporal.PlainDate
        .compare(verificationDate, birthDate.with({year: verificationDate.year})) < 0);

    return age >= minAge;
}


/**
 * Age verification function that takes into account time and location information, implemented using Temporal API.
 * @param onDate
 * @param birthday
 * @param minAge
 * @param forceMarch1
 * @returns {boolean}
 */
function isOfAgeWithLocation(onDate, birthday, minAge = 18, forceMarch1 = false) {
    const requiredYears = Temporal.Duration.from({years: minAge});
    let adjustedBirthday = birthday.add(requiredYears);

    if (forceMarch1 && birthday.month === 2 && birthday.day === 29 && !onDate.toPlainDate().inLeapYear) adjustedBirthday = adjustedBirthday.add({days: 1});

    return Temporal.ZonedDateTime.compare(onDate, adjustedBirthday) >= 0;
}


export {isOfAgeUsingDate, isOfAgeUsingTemporal, isOfAgeWithLocation};