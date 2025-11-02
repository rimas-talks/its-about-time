# It's About Time...
## JavaScript Temporal API
_A talk by_ [Rimas Krivickas](https://www.linkedin.com/in/rimaskrivickas/).

Time zones, date arithmetic, and daylight saving - JavaScript’s Date object (introduced in 1995, and very few updates along the way) has made them all harder than they should be.
The new Temporal API changes that.

This talk explores how Temporal API brings reliable, intuitive, and time zone-aware date and time handling to modern JavaScript. You’ll learn how it fixes long-standing quirks of the Date object and makes working with time a pleasure rather than a source of peculiar bugs and recurring  headaches.

Introducing the JavaScript Temporal API - a long-overdue update, and a significant improvement to how developers work with dates and time in JavaScript.

* Watch the presentation on [YouTube](https://youtu.be/MzhKKB8Z61k).
* Explore the code used in the presentation on [GitHub](https://github.com/rimas-talks/its-about-time).
* Check the current status of the [proposal](https://tc39.es/proposal-temporal/).

---



### New Building Blocks


#### Temporal.Now
Precise, time zone–aware access to the current date and time.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/now.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Now)

###### _Examples:_

```js
  // Get the current system exact time
  Temporal.Now.instant();

  // Get the current system time zone
  Temporal.Now.timeZoneId();

  // Get the current date and wall-clock time in the system time zone and ISO-8601 calendar
  Temporal.Now.zonedDateTimeISO();

  // Get the current date in the system time zone and ISO-8601 calendar
  Temporal.Now.plainDateISO();

  // Get the current wall-clock time in the system time zone and ISO-8601 calendar
  Temporal.Now.plainTimeISO();

  // Same as above, but return the DateTime in the ISO-8601 calendar
  Temporal.Now.plainDateTimeISO();
```


#### Temporal.Instant
Precise and immutable point in time on the global timeline.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/instant.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant)

###### _Examples:_

```js
const instant = Temporal.Instant.from('1969-07-20T20:17Z');
console.log(instant.toString()); // '1969-07-20T20:17:00Z'
console.log(instant.epochMilliseconds); // -14182980000
```


#### Temporal.ZonedDateTime
Specific moment in time together with a time zone and calendar.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/zoneddatetime.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime)

###### _Examples:_

```js
const inBerlin = Temporal.ZonedDateTime.from('2022-01-28T19:53+01:00[Europe/Berlin]');
const inTokyo = inBerlin.withTimeZone('Asia/Tokyo');
console.log(inBerlin.toString()); // 2022-01-28T19:53:00+01:00[Europe/Berlin]
console.log(inTokyo.toString()); // 2022-01-29T03:53:00+09:00[Asia/Tokyo]
```


#### Temporal.PlainDateTime
Calendar date and wall-clock time without time zone or offset information.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/plaindatetime.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime)

###### _Examples:_

```js
const datetime = new Temporal.PlainDateTime(2020, 3, 14, 13, 37);
console.log(datetime.toString()); // 2020-03-14T13:37:00
```


#### Temporal.PlainDate
Represents a calendar date without any time or time zone.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/plaindate.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate)

###### _Examples:_

```js
const date = new Temporal.PlainDate(2020, 3, 14);
console.log(date.toString()); // 2020-03-14
```


#### Temporal.PlainTime
Represents a time of day without any date or time zone.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/plaintime.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainTime)

###### _Examples:_

```js
const time = new Temporal.PlainTime(13, 37);
console.log(time.toString()); // 13:37:00
```


#### Temporal.PlainYearMonth
Represents a specific month in a specific year without a day or time.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/plainyearmonth.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainYearMonth)

###### _Examples:_

```js
const yearMonth = Temporal.PlainYearMonth.from({ year: 2020, month: 10 });
console.log(yearMonth.toString()); // 2020-10
console.log(yearMonth.daysInMonth); // 31
```


#### Temporal.PlainMonthDay
Represents a specific month and day without a year or time.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/plainmonthday.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainMonthDay)

###### _Examples:_

```js
const monthDay = Temporal.PlainMonthDay.from({ month: 7, day: 14 });
console.log(monthDay.toString()); // 07-14

// Apply to a specific year
const date = monthDay.toPlainDate({ year: 2030 });
console.log(date.toString()); // 2030-07-14
console.log(date.dayOfWeek); // 7
```


#### Temporal.Duration
An amount of time such as days, hours, or minutes, etc. rather than a specific point in time.
* Documentation: [TC39](https://tc39.es/proposal-temporal/docs/duration.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Duration)
* Duration balancing: [TC39](https://tc39.es/proposal-temporal/docs/balancing.html)

###### _Examples:_

```js
const duration = Temporal.Duration.from({
    hours: 130,
    minutes: 20
});
console.log(duration.total({ unit: 'second' })); // 469200
```


#### Object Relationship Diagram
 * Source: [TC39](https://tc39.es/proposal-temporal/docs/#object-relationship)
 * Also see: 
   * [String persistence, parsing, and formatting](https://tc39.es/proposal-temporal/docs/#string-persistence-parsing-and-formatting)
   * [Conversion between classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#conversion_between_classes)

![Object Relationship Diagram](assets/or_diagram.png)

---



### Nanosecond Precision
Temporal API introduces nanosecond precision to UTC timestamp.

###### _Comparison of available APIs:_

| API                                 | Nanosecond Precision?    | Absolute UTC? | Notes                                                    |
|-------------------------------------|--------------------------|---------------|----------------------------------------------------------|
| `Date.now()` | ❌ No (milliseconds)      | ✅ Yes         | Normal UTC timestamp.                                    |
| `performance.now()`                 | ⚠️ Yes (micro/nanoseconds) | ❌ No          | Relative to page or process start, not UTC.              |
| `process.hrtime.bigint()`           | ✅ Yes                    | ❌ No          | High-resolution, monotonic; not tied to wall-clock time. |
| `Temporal.Now.instant()`            | ✅ Yes                    | ✅ Yes         | True absolute UTC time with nanosecond precision.        |

#### Precision Caveats
While ECMAScript specification states that Temporal API uses nanosecond precision, which offers six orders of magnitude more granularity, and significantly improves precision when doing date and time arithmetic - capturing current time in nanoseconds is more nuanced and system dependent due to how JavaScript engine itself uses available syscalls.

As demonstrated during the talk - you are more likely to be capturing time at microsecond precision. This limitation however would be also present in other languages such as Java, Python, Ruby, etc. on the same system.

This limitation does not apply to any other Temporal API calls. If you instantiate two `Temporal.Instant` objects with nanoseconds provided, arithmetic between those objects would honour the nanosecond precision.

_Additionally, see:_
 * [Note regarding nanosecond accuracy](https://tc39.es/proposal-temporal/docs/now.html)
 * [Reduced time precision](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Now#reduced_time_precision)

---



### Multiple Calendar Systems
Most of the world uses [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar) as represented by [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), but many other calendar systems exist, and are widely used around the world.
Therefore, in Temporal AP dates have associated calendar IDs, which allows us to perform complex calendar-related math.
* Documentation: [TS39 (1)](https://tc39.es/proposal-temporal/docs/calendars.html), [TC39 (2)](https://tc39.es/proposal-temporal/#sec-temporal-calendars), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#calendars)

###### _Examples:_

```js
// Derive the date of the Chinese New Year for a given year
const chineseNewYear = year =>
    Temporal.PlainDate.from( { year: year, month: 7, day: 1 } )
        .withCalendar( 'chinese' ).with( { month: 1, day: 1 } )
        .withCalendar( 'iso8601' );
```

#### Calendar Systems Caveats
ECMAScript specification [states](https://tc39.es/proposal-temporal/#sec-calendar-types) that:
> At a minimum, implementations must support a built-in calendar named `iso8601`, representing the ISO 8601 calendar.
In addition, implementations _**may**_ support any number of other built-in calendars corresponding with those of the [Unicode Common Locale Data Repository (CLDR)](https://cldr.unicode.org/).

⚠️ That means that you _**should not**_ assume that the JavaScript engine your application runs in, or that a polyfill you're using, has the calendar you need, nor that the implementation of it is accurate.

---



### Summary
 * Extensive set of objects 
 * Immutability 
 * Rich & expressive APIs 
 * Easy date arithmetic with Durations 
 * Explicit timezone control 
 * DST disambiguation modes 
 * Nanosecond precision (sort of…)
 * Multiple calendar system support 
 * January = 1

---



### References & Further Reading
 * [Date, MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
 * [Temporal, MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
 * [Why is it Called UTC - not CUT?](https://www.timeanddate.com/time/utc-abbreviation.html)
 * [Time Zone Database, IANA](https://www.iana.org/time-zones)
 * [Time Zones and Resolving Ambiguity](https://tc39.es/proposal-temporal/docs/timezone.html)
 * [String Parsing, Serialization, and Formatting in ECMAScript Temporal](https://tc39.es/proposal-temporal/docs/strings.html)
 * [Temporal API Cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html)