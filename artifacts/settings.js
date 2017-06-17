"use strict";
let urls = {
    // 'post:cris': 'http://localhost:3002/api/cris',
    // 'post:luis': 'http://localhost:3002/api/luis',
    // 'post:pathFinder': 'http://localhost:3002/api/pathFinder'
    'get:path:finder:feature:families':'https://pathfinder.juniper.net/feature-explorer/getAllffNames.html',
    'get:path:finder:feature:names':'https://pathfinder.juniper.net/feature-explorer/getAllfetNames.html?ffKey={{ff_key}}',
    'post:path:finder:feature:details':'https://pathfinder.juniper.net/feature-explorer/fetSuppReleaseInfo.html',
    'get:fuzzy:feature:list':'https://pathfinder.juniper.net/feature-explorer/getAdvSearchFetResults.html?q={{query}}&schTyp=all'
};
exports.urls = urls;