"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedFieldTypes = exports.traversableFieldTypes = exports.translatableFieldTypes = void 0;
// fields which can be directly translated
exports.translatableFieldTypes = ["text", "textarea", "richText"];
// fields which can be recursively traversed
exports.traversableFieldTypes = [
    "group",
    "array",
    "tabs",
    "collapsible",
    "row",
];
// all supported field types combined
exports.supportedFieldTypes = __spreadArray(__spreadArray([], exports.translatableFieldTypes, true), exports.traversableFieldTypes, true);
//# sourceMappingURL=types.js.map