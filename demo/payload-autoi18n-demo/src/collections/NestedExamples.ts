import payload from "payload";
import { translatableFieldTypes } from "payload-autoi18n/types";
import { CollectionConfig, PayloadRequest } from "payload/types";
import TranslationButton from "../components/translate.field";
import { ttf, ttaf, rtf, unrollFields } from "./helper";

const Nested: CollectionConfig = {
  slug: "nested",
  fields: [
    TranslationButton,
    {
      type: "tabs",
      tabs: [
        {
          label: "Basic Information",
          fields: [
            {
              name: "title",
              type: "text",
              localized: true,
            },
            {
              name: "author",
              type: "text",
              localized: false,
            },
          ],
        },

        {
          name: "advanced",
          label: "Advanced Information",
          fields: [
            {
              name: "abstract",
              type: "richText",
              localized: true,
            },
          ],
        },
      ],
    },
  ],
};

export default Nested;
