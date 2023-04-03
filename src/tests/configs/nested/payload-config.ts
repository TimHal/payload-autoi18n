import { buildConfig } from "payload/config";
import autoI18nPlugin, { DeeplVendor } from "../../..";
import { CapitalTranslator } from "../../vendors/capitaltranslator";

export const nestedCollectionSlug: string = "nestedCollection";
export const arrayCollectionSlug: string = "arrayCollection";
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
      slug: nestedCollectionSlug,
      fields: [
        {
          type: "tabs",
          tabs: [
            /**
             * Test with one named and one unnamed tab
             */
            {
              name: "named_tab",
              label: "named_tab_label",
              fields: [
                {
                  name: "named_tab_localized_text",
                  type: "text",
                  localized: true,
                },
                {
                  name: "named_tab_static_number",
                  type: "number",
                  localized: false,
                },
              ],
            },
            {
              // note that unnamed tabs need to have a label set
              label: "Unnamed Tab",
              fields: [
                {
                  name: "unnamed_tab_localized_text",
                  type: "text",
                  localized: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: arrayCollectionSlug,
      fields: [
        {
          type: "array",
          name: "localizedArray",
          fields: [
            {
              type: "text",
              name: "localized_array_text",
              localized: true,
            },
            {
              type: "number",
              name: "static_array_number",
            },
          ],
        },
      ],
    },
  ],

  plugins: [
    autoI18nPlugin({
      collections: [nestedCollectionSlug, arrayCollectionSlug],
      vendor: new CapitalTranslator(),
      overwriteTranslations: false,
      auth: () => true,
      synchronize: false,
    }),
  ],
});
