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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("payload");
var types_1 = require("../types");
var payload_1 = __importDefault(require("payload"));
var errorHandler_1 = __importDefault(require("./errorHandler"));
/**
 * Recursively translates a whole document by traversing the field hierarchy.
 *
 * At each step the type of the current field is inspected, given the `collectionConfig`.
 * If the field is easily translatable (text, textarea, richText) all translations of the
 * target locales are requested from the vendor and merged together. The result can then
 * be patched using payload's update method.
 *
 * Note: Instead of passing the document directly, it is easier to specify the slug and id
 * separately, as the collection might describe a custom id (with a custom name to it).
 *
 * @param documentId
 * @param documentSlug
 * @param collectionConfig
 * @param vendor
 * @param sourceLocale
 * @param targetLocale
 * @param overwriteExistingTranslations
 * @param excludePaths
 *
 * @returns the updated document
 */
var translateDocument = function (documentId, documentSlug, collectionConfig, vendor, sourceLocale, targetLocale, overwriteExistingTranslations, excludePaths) { return __awaiter(void 0, void 0, void 0, function () {
    var translationPatch, document, _targetLocales, _i, _targetLocales_1, locale, _loop_1, _a, _b, field;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                translationPatch = {};
                return [4 /*yield*/, payload_1.default
                        .findByID({
                        id: documentId,
                        collection: documentSlug,
                        locale: "*",
                        showHiddenFields: true,
                        depth: 0,
                    })
                        .catch(errorHandler_1.default)];
            case 1:
                document = _c.sent();
                _targetLocales = Array.from(targetLocale).filter(function (l) { return l !== sourceLocale; });
                if (_targetLocales.length === 0 || !sourceLocale)
                    return [2 /*return*/];
                for (_i = 0, _targetLocales_1 = _targetLocales; _i < _targetLocales_1.length; _i++) {
                    locale = _targetLocales_1[_i];
                    _loop_1 = function (field) {
                        // it is not possible to provide meaningful translations for relationship fields, ui fields
                        // or some other data types - do not process those fields.
                        // supported fields include any text fields or containers which include other (possibly translatable)
                        // subfields.
                        if (!types_1.supportedFieldTypes.includes(field.type))
                            return "continue";
                        // make sure this is a named field, otherwise it is not possible to resolve or update
                        if (!Object.keys(field).includes("name"))
                            return "continue";
                        var currFieldName = field.name;
                        var currFieldValue = document[currFieldName];
                        // to determine how the field can be translated and updated we need to check it's config
                        // if the config should not be available skip the translation
                        var fieldConfig = collectionConfig.fields.find(function (cfg) { return cfg.name === currFieldName; });
                        if (!fieldConfig)
                            return "continue";
                        // the patch for this current field
                        translationPatch[currFieldName] = __assign(__assign({}, currFieldValue), { targetLocale: translateField({
                                value: currFieldValue,
                                field: fieldConfig,
                                vendor: vendor,
                                sourceLocale: sourceLocale,
                                targetLocale: locale,
                                overwriteExistingTranslations: overwriteExistingTranslations,
                            }) });
                    };
                    for (_a = 0, _b = collectionConfig.fields; _a < _b.length; _a++) {
                        field = _b[_a];
                        _loop_1(field);
                    }
                }
                console.log(translationPatch);
                return [4 /*yield*/, payload_1.default.update({
                        id: documentId,
                        collection: documentSlug,
                        data: translationPatch,
                    })];
            case 2: 
            // finally, apply the translation patch to the object
            return [2 /*return*/, _c.sent()];
        }
    });
}); };
/**
 * Translates a given field of a supported type.
 *
 * @param value
 * @param vendor
 * @param sourceLocale
 * @param targetLocale
 */
var translateField = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var value, field, vendor, sourceLocale, targetLocale, overwriteExistingTranslations, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                value = args.value, field = args.field, vendor = args.vendor, sourceLocale = args.sourceLocale, targetLocale = args.targetLocale, overwriteExistingTranslations = args.overwriteExistingTranslations;
                if (!types_1.translatableFieldTypes.includes(field.type)) return [3 /*break*/, 8];
                if (!value || !value[sourceLocale])
                    return [2 /*return*/, undefined];
                if (overwriteExistingTranslations === false && value[targetLocale])
                    return [2 /*return*/, value[targetLocale]];
                _a = field.type;
                switch (_a) {
                    case "text": return [3 /*break*/, 1];
                    case "textarea": return [3 /*break*/, 3];
                    case "richText": return [3 /*break*/, 5];
                }
                return [3 /*break*/, 7];
            case 1: return [4 /*yield*/, translateTextField(__assign(__assign({}, args), { text: value[sourceLocale] }))];
            case 2: return [2 /*return*/, _b.sent()];
            case 3: return [4 /*yield*/, translateTextareaField(__assign(__assign({}, args), { text: value[sourceLocale] }))];
            case 4: return [2 /*return*/, _b.sent()];
            case 5: return [4 /*yield*/, translateRichtextField(__assign(__assign({}, args), { node: value[sourceLocale] }))];
            case 6: return [2 /*return*/, _b.sent()];
            case 7: 
            // this should never happen as the switch-cases fully matches `translatableFields`
            return [3 /*break*/, 8];
            case 8:
                //
                if (types_1.traversableFieldTypes.includes(field.type)) {
                }
                return [2 /*return*/];
        }
    });
}); };
var translateTextField = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, args.vendor.translate(args.text, args.sourceLocale, args.targetLocale)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var translateTextareaField = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, args.vendor.translate(args.text, args.sourceLocale, args.targetLocale)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var translateRichtextField = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var node, value, field, vendor, sourceLocale, targetLocale, overwriteExistingTranslations;
    return __generator(this, function (_a) {
        node = args.node, value = args.value, field = args.field, vendor = args.vendor, sourceLocale = args.sourceLocale, targetLocale = args.targetLocale, overwriteExistingTranslations = args.overwriteExistingTranslations;
        return [2 /*return*/, node];
    });
}); };
exports.default = translateDocument;
//# sourceMappingURL=documentTranslator.js.map