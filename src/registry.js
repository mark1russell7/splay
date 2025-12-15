"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegistry = createRegistry;
function createRegistry() {
    var viewers = new Map();
    return {
        register: function (type, factory) {
            viewers.set(type, factory);
        },
        get: function (type) { return viewers.get(type); },
        has: function (type) { return viewers.has(type); },
    };
}
