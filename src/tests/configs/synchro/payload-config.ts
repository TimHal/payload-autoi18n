import { buildConfig } from "payload/config";
import autoI18nPlugin from "../../..";
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
      access: {
        create: () => true,
        update: () => true,
      },
      fields: [
        {
          name: "text",
          type: "text",
          localized: true,
        },
      ],
    },
  ],

  plugins: [
    autoI18nPlugin({
      collections: [simpleCollectionSlug],
      vendor: new CapitalTranslator(),
      overwriteTranslations: true,
      synchronize: true,
    }),
  ],
});
