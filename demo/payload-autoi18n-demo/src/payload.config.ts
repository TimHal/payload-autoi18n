import { buildConfig } from "payload/config";
import path from "path";
// import Examples from './collections/Examples';
import Users from "./collections/Users";
// import the autoI18nConfig
import autoI18nPlugin from "payload-autoi18n";
import { DeeplVendor } from "payload-autoi18n/vendors/deepl";
import Examples from "./collections/Examples";
import Nested from "./collections/NestedExamples";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  localization: {
    locales: ["en", "de"],
    defaultLocale: "en",
    fallback: true,
  },
  collections: [Users, Examples, Nested],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [
    autoI18nPlugin({
      overwriteTranslations: true,
      synchronize: false,
      localeAlias: { en: "EN", de: "DE" },
      // vendor: new DeeplVendor("<YOUR FREE API KEY HERE>"),
    }),
  ],
});
