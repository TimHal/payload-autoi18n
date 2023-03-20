"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("payload/config");
var __1 = __importDefault(require("../../.."));
var capitaltranslator_1 = require("../../vendors/capitaltranslator");
exports.default = (0, config_1.buildConfig)({
    admin: {
        disable: true,
    },
    localization: {
        locales: ['de', 'en', 'es'],
        defaultLocale: 'en',
        fallback: false,
    },
    collections: [
        {
            slug: 'simpleCollection',
            fields: [
                {
                    name: 'text',
                    type: 'text',
                    localized: true,
                },
                {
                    name: 'richText',
                    type: 'richText',
                    localized: true,
                }
            ]
        }
    ],
    plugins: [
        // autoI18nPlugin({ collections: ['simpleCollection'], vendor: new DeeplVendor(), overwriteTranslations: false, auth: () => true, synchronize: false })
        (0, __1.default)({ collections: ['simpleCollection'], vendor: new capitaltranslator_1.CapitalTranslator(), overwriteTranslations: false, auth: function () { return true; }, synchronize: false })
    ]
});
//# sourceMappingURL=payload-config.js.map