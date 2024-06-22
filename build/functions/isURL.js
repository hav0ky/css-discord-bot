"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.default = isUrl;
