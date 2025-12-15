"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatch = dispatch;
var infer_js_1 = require("./infer.js");
var path_js_1 = require("./path.js");
function dispatch(data, size, path, config) {
    var _a;
    var type = (0, infer_js_1.inferType)(data);
    var factory = config.registry.get(type);
    if (!factory) {
        return (_a = config.fallback) === null || _a === void 0 ? void 0 : _a.call(config, type, data);
    }
    var ctx = {
        data: data,
        size: size,
        path: path,
        depth: (0, path_js_1.pathDepth)(path),
        render: function (childData, childSize, childPath) {
            return dispatch(childData, childSize, childPath, config);
        },
    };
    return factory(ctx);
}
