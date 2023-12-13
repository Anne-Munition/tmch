"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const start = luxon_1.DateTime.now();
function getUptime() {
    const end = luxon_1.DateTime.now();
    const { days, hours, minutes, seconds } = end.diff(start, [
        'days',
        'hours',
        'minutes',
        'seconds',
    ]);
    return `${days} days ${hours} hours ${minutes} minutes ${Math.floor(seconds)} seconds`;
}
exports.default = getUptime;
