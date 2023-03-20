import { buildConfig } from "payload/config";
import autoI18nPlugin, { DeeplVendor } from "../../..";
import { CapitalTranslator } from "../../vendors/capitaltranslator";

export const simpleCollectionSlug: string = "simpleCollection";
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
      // access: {
      //   create: () => true,
      //   read: () => true,
      //   update: () => true,
      //   delete: () => true,
      // },

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
      ],
    },
  ],

  plugins: [
    autoI18nPlugin({
      collections: ["simpleCollection"],
      vendor: new CapitalTranslator(),
      overwriteTranslations: false,
      auth: () => true,
      synchronize: false,
    }),
  ],
});
