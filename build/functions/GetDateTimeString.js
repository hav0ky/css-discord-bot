"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetDateTimeString = (date) => {
    const newDate = date ? new Date(date) : new Date();
    return newDate.toLocaleDateString() + ' - ' + newDate.toLocaleTimeString();
};
exports.default = GetDateTimeString;
