import { buildConfig } from "payload/config";

export default buildConfig({

  admin: {
    disable: true,
  },
  localization: {
    locales: ["de", "en"],
    defaultLocale: "en",
    fallback: false,
  },

  collections: [
    {
      slug: "documents",
      fields: [
        {
          name: "text",
          type: "text",
          localized: true,
        }
      ]
    }
  ],

  plugins: []

})
