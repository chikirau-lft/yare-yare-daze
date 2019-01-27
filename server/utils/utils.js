'use strict';

const _ = require('lodash');

const arrayToObject = array => {
    return array
        .map(element => JSON.parse(element))
        .reduce((obj, item) => { return {...obj, ...item}; });
};

const parseFilter = filter => {
    const start = filter.indexOf('['), 
          end = filter.indexOf(']');

    if (start !== -1 && end !== -1) {
        const arr = filter.substring(start + 1, end - 1);
        const res = arr.split('}').map(s => s + '}');
        
        if (res[0] === '[}') 
            return JSON.parse(_.replace(filter, new RegExp("\'","g"), "\"")); 
        
        const jsonString = filter.substring(0, start) + '[' + res.join(',') + ']}';
        const json = _.replace(jsonString, new RegExp("\'","g"), "\"");

        return JSON.parse(json);
    }
    return JSON.parse(_.replace(filter, new RegExp("\'","g"), "\""));
};

module.exports = {
    arrayToObject,
    parseFilter
};