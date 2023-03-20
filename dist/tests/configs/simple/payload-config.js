"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleCollectionSlug = void 0;
var config_1 = require("payload/config");
var __1 = __importDefault(require("../../.."));
var capitaltranslator_1 = require("../../vendors/capitaltranslator");
exports.simpleCollectionSlug = "simpleCollection";
exports.default = (0, config_1.buildConfig)({
    admin: {
        disable: true,
    },
    debug: true,
    telemetry: false,
    localization: {
        locales: ["de", "en", "es"],
        defaultLocale: "en",
        fallback: false,
    },
    collections: [
        {
            slug: exports.simpleCollectionSlug,
            access: {
                create: function () { return true; },
                read: function () { return true; },
                update: function () { return true; },
                delete: function () { return true; },
            },
            fields: [
                {
                    name: "text",
                    type: "text",
                    localized: true,
                },
                // {
                //   name: "richText",
                //   type: "richText",
                //   localized: true,
                //   required: false,
                // },
            ],
        },
    ],
    plugins: [
        //   autoI18nPlugin({
        //     collections: ["simpleCollection"],
        //     vendor: new DeeplVendor(),
        //     overwriteTranslations: false,
        //     auth: () => true,
        //     synchronize: false,
        //   }),
        (0, __1.default)({
            collections: ["simpleCollection"],
            vendor: new capitaltranslator_1.CapitalTranslator(),
            overwriteTranslations: false,
            auth: function () { return true; },
            synchronize: false,
        }),
    ],
});
//# sourceMappingURL=payload-config.js.map