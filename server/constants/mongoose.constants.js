'use strict';

const bulk_counter_max = 500;
const bulk_response = {
    inserted: 0,
    deleted: 0,
    modified: 0,
    matched: 0
};

module.exports = {
    bulk_counter_max,
    bulk_response
};
