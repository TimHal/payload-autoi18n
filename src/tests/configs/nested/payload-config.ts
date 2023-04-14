import { buildConfig } from "payload/config";
import autoI18nPlugin from "../../..";
import { CapitalTranslator } from "../../vendors/capitaltranslator";

export const nestedCollectionSlug: string = "nestedCollection";
export const arrayCollectionSlug: string = "arrayCollection";
export const structuralCollectionSlug: string = "structuralCollection";
export const representationalCollectionSlug: string =
  "representationalCollection";

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
    {
      slug: structuralCollectionSlug,
      fields: [
        {
          name: "locals",
          type: "group",
          fields: [
            {
              name: "group_localized_text",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "group_static_text",
              type: "text",
              localized: false,
              required: true,
            },
          ],
        },
        {
          name: "nonlocals",
          type: "group",
          fields: [
            {
              name: "group_nonlocal_static_text",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      slug: representationalCollectionSlug,
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "row_localized_text",
              type: "text",
              localized: true,
            },
            {
              name: "row_static_number",
              type: "number",
              localized: false,
            },
            {
              label: "nested_collapsibles",
              type: "collapsible",
              fields: [
                {
                  name: "collapsible_localized_text",
                  type: "text",
                  localized: true,
                },
                {
                  name: "collapsible_static_text",
                  type: "text",
                  localized: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  plugins: [
    autoI18nPlugin({
      collections: [
        nestedCollectionSlug,
        arrayCollectionSlug,
        structuralCollectionSlug,
        representationalCollectionSlug,
      ],
      vendor: new CapitalTranslator(),
      overwriteTranslations: false,
      synchronize: false,
    }),
  ],
});
