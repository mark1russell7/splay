"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatch = exports.isDynamic = exports.resolve = exports.pathDepth = exports.objectPath = exports.arrayPath = exports.splitLayout = exports.listLayout = exports.gridLayout = exports.createRegistry = exports.inferType = void 0;
__exportStar(require("./types.js"), exports);
var infer_js_1 = require("./infer.js");
Object.defineProperty(exports, "inferType", { enumerable: true, get: function () { return infer_js_1.inferType; } });
var registry_js_1 = require("./registry.js");
Object.defineProperty(exports, "createRegistry", { enumerable: true, get: function () { return registry_js_1.createRegistry; } });
var layout_js_1 = require("./layout.js");
Object.defineProperty(exports, "gridLayout", { enumerable: true, get: function () { return layout_js_1.gridLayout; } });
Object.defineProperty(exports, "listLayout", { enumerable: true, get: function () { return layout_js_1.listLayout; } });
Object.defineProperty(exports, "splitLayout", { enumerable: true, get: function () { return layout_js_1.splitLayout; } });
var path_js_1 = require("./path.js");
Object.defineProperty(exports, "arrayPath", { enumerable: true, get: function () { return path_js_1.arrayPath; } });
Object.defineProperty(exports, "objectPath", { enumerable: true, get: function () { return path_js_1.objectPath; } });
Object.defineProperty(exports, "pathDepth", { enumerable: true, get: function () { return path_js_1.pathDepth; } });
var resolve_js_1 = require("./resolve.js");
Object.defineProperty(exports, "resolve", { enumerable: true, get: function () { return resolve_js_1.resolve; } });
Object.defineProperty(exports, "isDynamic", { enumerable: true, get: function () { return resolve_js_1.isDynamic; } });
var dispatch_js_1 = require("./dispatch.js");
Object.defineProperty(exports, "dispatch", { enumerable: true, get: function () { return dispatch_js_1.dispatch; } });
