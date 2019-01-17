'use strict';

const generateProperties = (_embedded, _id, _size, pagesize, count) => {
    let properties = {
        _embedded,
        _id,
        _returned: _embedded.length
    };

    if (count) {
        Object.assign(properties, {
            _size,
            _total_pages: Math.ceil(_size / pagesize)
        });
    }
    return properties;
};

module.exports = {
    generateProperties
};