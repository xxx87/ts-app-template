import fs from "fs";
import crypto from "node:crypto";

/**
 * Returns the last digit of a number.
 *
 * @param {number} num
 * @return {number}
 */
const getLastDigit = (num: number): number => {
  return Math.abs(num) % 10;
};

/**
 * Applies a discount percentage to a price and return the price minus the specified percentage
 *
 * @param {number} value
 * @param {number} fractionDigits
 * @return {number}
 */
const ceil = (value: number, fractionDigits?: number): number => {
  if (fractionDigits) {
    return +value.toFixed(fractionDigits);
  }

  return Math.ceil(value);
};

/**
 * Converts an object to an array of objects. Where id is the key of the original object.
 *
 * @param {object} obj - {'key': {...}}
 * @return {array} [{id: 'key'}]
 */
const objToArr = (obj: { [key: string]: any }) => {
  if (!obj || typeof obj !== "object") {
    return [];
  }
  return Object.entries(obj).map((entry) => {
    return {
      id: entry[0],
      ...(entry[1] ?? {}),
    };
  });
};

/**
 * Concatenates the key values of an object and return a new object from the object's values.
 * Values sorted in ascending order
 *
 * @param {object} obj - {k1: {a: [5, 7], b: [9, 8]}, k2: {a: [2, 8], c: [11, 0]}}
 * @return {object} - {a: [2, 5, 7, 8], b: [8, 9], c: [0, 11]}
 */
const mergeObject = (obj: any) => {
  const mergedObj: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      for (const prop in obj[key]) {
        if (Object.prototype.hasOwnProperty.call(obj[key], prop)) {
          mergedObj[prop] = (mergedObj[prop] || []).concat(obj[key][prop]);
        }
      }
    }
  }

  for (const prop in mergedObj) {
    if (Object.prototype.hasOwnProperty.call(mergedObj, prop)) {
      mergedObj[prop].sort((a: number, b: number) => a - b);
    }
  }

  return mergedObj;
};

/**
 * Generates a random, integer from "min" to "max"
 * Maximum not included, minimum included
 *
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // Максимум не включается, минимум включается
};

/**
 * Decodes a base64 string
 *
 * @param {string} str
 * @return {string}
 */
const base64Decode = (str: string): string =>
  Buffer.from(str, "base64").toString();

/**
 * Fills the array with the value "null"
 *
 * @param {string[]} array
 * @param {number} nullCount - The number of "null" values that need to be filled in the original array
 * @return { (string | null)[]}
 * @example ['val1', null, null]
 */
const supplementNull = (
  array: string[],
  nullCount: number,
): (string | null)[] => {
  const nullArr: null[] = Array.from({ length: nullCount }, () => null);
  return [...array, ...nullArr];
};

/**
 * Shuffles the values of the specified array.
 *
 * @param {(string | null)[]} array
 * @return {(string | null)[]}
 */
const shuffle = (array: (string | null)[]): (string | null)[] => {
  let i = array.length,
    j = 0,
    temp;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

/**
 * Groups an array of objects by the specified key.
 * Returns a new object
 *
 * @param {any} arr
 * @param {string} property
 * @return {object}
 */
const groupBy = (arr: any, property: string): Record<string, any> => {
  return arr.reduce((memo: any, x: any) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
};

/**
 * Applies a discount percentage to a price and return the price minus the stated percentage
 *
 * @param {number} price
 * @param {number} percentageValue
 * @return {number}
 */
const getPercentageOff = (price: number, percentageValue: number): number => {
  return price * (1 - percentageValue / 100);
};

/**
 * Compares the structures of two objects for identity
 *
 * @param {object} obj1
 * @param {object} obj2
 * @returns {boolean}
 */
const compareObjectStructure = (obj1: any, obj2: any): boolean => {
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false;
    }

    const value1 = obj1[key];
    const value2 = obj2[key];

    if (typeof value1 !== typeof value2) {
      return false;
    }

    if (typeof value1 === "object" && !compareObjectStructure(value1, value2)) {
      return false;
    }
  }
  return true;
};

/**
 * Generate random hash sha1
 *
 * @returns {string}
 */
const randomHash = (): string => {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  return crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
};

/**
 * Checks the existence of a directory
 * and creates it if it does not exist.
 *
 * @returns {void}
 */
const checkFolders = (path: string): void => {
  fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
      fs.mkdir(path, (err) => {
        if (err) throw err;
        fs.chmod(path, 0o777, (err) => {
          if (err) throw err;
          // g.log.debug("Catalogs created, rights granted");
        });
      });
    }
  });
};

/**
 * Converts a time string to milliseconds
 *
 * @param {string} time
 * @return {number}
 * @example timeToMilliseconds("10s") // 10000
 */
const timeToMilliseconds = (time: string): number => {
  const timePattern = /^(\d+)(ms|s|m|h)$/;
  const match = time.match(timePattern);

  if (!match) {
    throw new Error(
      "Invalid time format. Use 'ms' for milliseconds, 's' for seconds, 'm' for minutes, or 'h' for hours.",
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error("Invalid time unit.");
  }
};

export {
  getLastDigit,
  ceil,
  objToArr,
  mergeObject,
  getRandomInt,
  base64Decode,
  supplementNull,
  shuffle,
  groupBy,
  getPercentageOff,
  compareObjectStructure,
  randomHash,
  checkFolders,
  timeToMilliseconds,
};
