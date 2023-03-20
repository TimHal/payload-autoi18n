"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleCollectionSlug = void 0;
var config_1 = require("payload/config");
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
                {
                    name: "richText",
                    type: "richText",
                    localized: true,
                },
            ],
        },
    ],
    plugins: [
    // autoI18nPlugin({ collections: ['simpleCollection'], vendor: new DeeplVendor(), overwriteTranslations: false, auth: () => true, synchronize: false })
    // autoI18nPlugin({ collections: ['simpleCollection'], vendor: new CapitalTranslator(), overwriteTranslations: false, auth: () => true, synchronize: false })
    ],
});
//# sourceMappingURL=payload-config.js.map