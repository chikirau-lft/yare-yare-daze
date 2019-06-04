'use strict';

const arrayToObject = array => {
    return array
        .map(element => JSON.parse(element))
        .reduce((obj, item) => { return {...obj, ...item}; });
};

const curry = (fn) => {
    return function f1(...args) {
        if (args.length >= fn.length) {
            return fn.bind(null, ...args);
        } else {
            return function f2(...moreArgs) {
                const newArgs = args.concat(moreArgs)
                return f1.bind(null, ...newArgs);
            }
        }
    }
}

module.exports = {
    arrayToObject,
    curry
};
