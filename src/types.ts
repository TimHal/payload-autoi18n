import { Field } from "payload/dist/fields/config/types";
import { PayloadRequest } from "payload/dist/types";

// aliasing for clarification
export type locale = string;

// vendors provided by this plugin (adding google.translate and chatgpt eventually)
export type builtinVendors = "deepl";

// fields which can be directly translated
export const translatableFieldTypes = ["text", "textarea", "richText"];
// fields which can be recursively traversed
export const traversableFieldTypes = [
  "group",
  "array",
  "tabs",
  "collapsible",
  "row",
];
// all supported field types combined
export const supportedFieldTypes = [
  ...translatableFieldTypes,
  ...traversableFieldTypes,
];

export type OverrideConfig = {
  endpointName: string;
};

// TODO: this is not correct
type customVendor = (...args: any[]) => TranslationVendor;

export type AutoI18nConfig = {
  // The translation service/vendor to use. Defaults to `deepl`
  vendor: builtinVendors;

  // If set to `true` will override the entries
  overwriteTranslations: boolean;

  // If set to `true` will auto-translate after each document creation or update using payload hooks
  synchronize: boolean;

  // alias the payload locales to country-codes for your vendor
  localeAlias?: Record<string, string>;

  //
  auth: (req: PayloadRequest) => boolean;

  collections?: Array<string>;
  overrides?: Partial<OverrideConfig>;
};

export type VendorConfig = {
  apiKey: string;
  apiUrl: string;
};

export interface TranslationVendor {
  translate(
    text: string,
    sourceLocale: locale,
    targetLocale: locale
  ): Promise<string>;
}

export type TranslationArgs = {
  value: any;
  field: Field;
  vendor: TranslationVendor;
  sourceLocale: locale;
  targetLocale: locale;
  overwriteExistingTranslations: boolean;
};
