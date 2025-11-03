# It's About Time...
This repository contains code examples used in the talk _'It's About Time... JavaScript Temporal API'_ which can be found [here](https://rimas-talks.github.io/its-about-time/).

## About Running the Examples
Respective scripts have been set up for all examples, and are listed below.
Before running them, please ensure that all prerequisites and setup have been completed.

### Prerequisites
It is recommended to use `node` version '24.11.0' or higher. The easiest option is to use `nvm`, and switch to the required version by running the following command in the root directory of the project:

```shell
nvm use
```

Run this command to confirm that the correct version is being used:

```shell
node -v
```

Finally, install the dependencies:

```shell
npm install
```

## Examples

### Age Verification
Age verification script is implemented as an interactive prompt that allows you to select which function you want to test, and then captures the required details.
 * _**Simple (using Date)**_ - a simple age verification function, does not take into account time or timezones, implemented using Date object.
 * _**Simple (using Temporal API)**_ - same as the above, but implemented using Temporal API.
 * _**Location-aware**_ - age verification function that takes into account time and location information, implemented using Temporal API.

Use the following command to run the example:

```shell
npm run dob
```

### Precision

Use the following command to run the example:

```shell
npm run precision
```