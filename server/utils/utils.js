'use strict';

const arrayToObject = array => {
    return array
        .map(element => JSON.parse(element))
        .reduce((obj, item) => { return {...obj, ...item}; });
};

module.exports = {
    arrayToObject
};
