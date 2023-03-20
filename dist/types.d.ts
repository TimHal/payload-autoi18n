import { Field } from "payload/dist/fields/config/types";
import { PayloadRequest } from "payload/dist/types";
export type locale = string;
export declare const translatableFieldTypes: string[];
export declare const traversableFieldTypes: string[];
export declare const supportedFieldTypes: string[];
export type OverrideConfig = {
    endpointName: string;
};
export type AutoI18nConfig = {
    vendor: TranslationVendor;
    overwriteTranslations: boolean;
    synchronize: boolean;
    localeAlias?: Record<string, string>;
    auth: (req: PayloadRequest) => boolean;
    collections?: Array<string>;
    overrides?: Partial<OverrideConfig>;
};
export type VendorConfig = {
    apiKey: string;
    apiUrl: string;
};
export interface TranslationVendor {
    translate(text: string, sourceLocale: locale, targetLocale: locale): Promise<string>;
}
export type TranslationArgs = {
    value: any;
    field: Field;
    vendor: TranslationVendor;
    sourceLocale: locale;
    targetLocale: locale;
    overwriteExistingTranslations: boolean;
};
