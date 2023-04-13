import { buildConfig } from "payload/config";
import autoI18nPlugin, { DeeplVendor } from "../../..";
import { CapitalTranslator } from "../../vendors/capitaltranslator";

export const simpleCollectionSlug: string = "simpleCollection";

/**
 * A simple collection where all translatable fields are top-level.
 * For this reason it is considered `simple` (no field unrolling required)
 */
export default buildConfig({
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
      slug: simpleCollectionSlug,
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
          required: false,
        },

        /**
         * This field should be ignored by the plugin as numbers
         * can not be translated in a meaningful way
         */
        {
          name: "count",
          type: "number",
          localized: true,
        },

        /**
         * This thext is not localized and should not be translated
         */
        {
          name: "nonlocalText",
          type: "text",
          localized: false,
        },

        /**
         * This text is implicitly not localized, it should not
         * be translated either
         */
        {
          name: "implicitNonlocalText",
          type: "text",
        },
      ],
    },
  ],

  plugins: [
    autoI18nPlugin({
      collections: ["simpleCollection"],
      vendor: new CapitalTranslator(),
      overwriteTranslations: false,
      synchronize: false,
    }),
  ],
});
