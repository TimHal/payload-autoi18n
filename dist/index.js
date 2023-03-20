"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeeplVendor = void 0;
var translate_endpoint_1 = __importDefault(require("./endpoint/translate.endpoint"));
var deepl_1 = require("./vendors/deepl");
Object.defineProperty(exports, "DeeplVendor", { enumerable: true, get: function () { return deepl_1.DeeplVendor; } });
/**
 *
 * @param _incomingAutoI18nConfig
 * @returns
 */
var autoI18nPlugin = function (_incomingAutoI18nConfig) {
    return function (config) {
        var _a;
        /**
         * This plugin is useless without present localizations
         */
        if (!config.localization) {
            return config;
        }
        var locales = config.localization.locales;
        var defaultLocale = config.localization.defaultLocale;
        var _deepl = new deepl_1.DeeplVendor();
        var mergedConfig = __assign(__assign({}, config), { collections: (_a = config.collections) === null || _a === void 0 ? void 0 : _a.map(function (collection) {
                var _a, _b;
                var collectionConfig = (_a = config.collections) === null || _a === void 0 ? void 0 : _a.find(function (c) { return c.slug === collection.slug; });
                if (!collectionConfig) {
                    throw new Error("Unable to resolve config for ".concat(collection.slug));
                }
                console.log("Setting up translation endpoint for ".concat(collectionConfig.slug));
                var translationEndpoint = {
                    path: "/:id/translate",
                    method: "post",
                    root: false,
                    handler: (0, translate_endpoint_1.default)(__assign(__assign({}, _incomingAutoI18nConfig), { config: collectionConfig, implementedVendor: _deepl, collectionSlug: collection.slug, locales: locales, defaultLocale: defaultLocale })),
                };
                return __assign(__assign({}, collection), { endpoints: __spreadArray(__spreadArray([], ((_b = collection.endpoints) !== null && _b !== void 0 ? _b : []), true), [translationEndpoint], false) });
            }) });
        return mergedConfig;
    };
};
exports.default = autoI18nPlugin;
//# sourceMappingURL=index.js.map