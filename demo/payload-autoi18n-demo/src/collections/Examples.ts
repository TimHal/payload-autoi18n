import payload from "payload";
import { translatableFieldTypes } from "payload-autoi18n/types";
import { CollectionConfig, PayloadRequest } from "payload/types";
import { rtf, ttaf, ttf } from "./helper";

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Examples: CollectionConfig = {
  slug: "examples",
  admin: {
    useAsTitle: "someField",
  },
  fields: [
    {
      name: "name",
      type: "text",
      localized: true,
    },
    {
      name: "someField",
      type: "text",
      localized: true,
    },
    {
      name: "description",
      type: "richText",
      localized: true,
    },
    {
      name: "untranslatable",
      type: "text",
      localized: false,
    },
  ],
};

export default Examples;
